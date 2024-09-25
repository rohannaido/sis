import { useEffect, useState } from "react";
import CircularProgress from "../ui/circular-progress";
import axios from "axios";
import { toast } from "sonner";
import { useToast } from "../ui/use-toast";
import { jobsList as jobsListAtom } from "@/store/atoms/jobs";
import { useRecoilState } from "recoil";

export default function JobProgress() {
  const { toast } = useToast();
  const [jobs, setJobs] = useRecoilState<any[] | null>(jobsListAtom);

  async function fetchUserJobs() {
    try {
      const response = await axios.get("/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async function updateJobCompletedNotified(jobId: string) {
    try {
      await axios.patch(`/api/jobs/${jobId}/completeNotified`);
      fetchUserJobs();
    } catch (error) {
    } finally {
    }
  }

  async function fetchJobProgress(jobId: string) {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);

      setJobs(
        (prevJobs) =>
          prevJobs?.map((job) =>
            job.id === jobId
              ? { ...job, progress: response.data.progress }
              : job
          ) || null
      );

      if (response.data.status == "COMPLETED") {
        updateJobCompletedNotified(jobId);
        toast({
          title: `Job completed - ${response.data.title}`,
        });
      }
    } catch (error) {
      console.error(`Error fetching progress for job ${jobId}:`, error);
    }
  }

  useEffect(() => {
    const intervalIds = jobs?.map((job) => {
      return setInterval(() => fetchJobProgress(job.id), 2500);
    });

    return () => {
      intervalIds?.forEach(clearInterval);
    };
  }, [jobs]);

  useEffect(() => {
    fetchUserJobs();
  }, []);

  return (
    <>
      {jobs?.length ? (
        jobs?.map((jobItem, index) => (
          <CircularProgress key={index} progress={jobItem.progress} size={40} />
        ))
      ) : (
        <></>
      )}
    </>
  );
}
