import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ClassGradeDeleteAlertProps {
  classGradeId: number;
  children: React.ReactNode;
  classGradeTitle: string;
  onDeleteSuccess: () => void;
}

export const ClassGradeDeleteAlert: React.FC<ClassGradeDeleteAlertProps> = ({ classGradeId, children, classGradeTitle, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/classGrades/${classGradeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success("Class grade deleted successfully");
        onDeleteSuccess();
      } else {
        throw new Error("Failed to delete class grade");
      }
    } catch (error) {
      toast.error("Error deleting class grade");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the class {classGradeTitle} and its related 
            data (students, sections, subjects, teacher class grade subjects, time table).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};