async function fetchSlotGroups() {
  try {
    const response = await fetch(`/api/admin/slot-groups`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching slot groups:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
  }
}

async function fetchSlotGroupDetails(slotGroupId: number) {
  try {
    const response = await fetch(
      `/api/admin/slot-groups/${slotGroupId}?forFullweek=true`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching slot group:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
  }
}

async function fetchClassGrades() {
  try {
    const response = await fetch(`/api/admin/classGrades`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching class grades:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
  }
}

async function fetchSectionsForClassGrade(classGradeId: number) {
  try {
    const response = await fetch(
      `/api/admin/classGrades/${classGradeId}/sections`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching sections:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
  }
}

async function fetchSubjectsForClassGrade(classGradeId: number) {
  try {
    const response = await fetch(
      `/api/admin/classGrades/${classGradeId}/subjects`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching subjects:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
  }
}

async function fetchTeachersForSubject(classGradeId: number, subjectId: number) {
  try {
    const response = await fetch(
      `/api/admin/teachers?classGradeId=${classGradeId}&subjectId=${subjectId}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching teachers:", err);
    throw err; // Re-throw the error to be handled by the caller
  } finally {
  }
}

async function fetchTimeTable(timeTableId: number) {
  try {
    const response = await fetch(`/api/admin/time-table/${timeTableId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching time table:", err);
    throw err; // Re-throw the error to be handled by the caller
  }
}

async function updateTimeTable(timeTableId: number, timeTable: any) {
  try {
    const response = await fetch(`/api/admin/time-table/${timeTableId}`, {
      method: "PUT",
      body: JSON.stringify(timeTable),
    });
  } catch (err) {
    console.error("Error saving time table:", err);
    throw err; // Re-throw the error to be handled by the caller
  }
}

async function createTimeTable(timeTable: any) {
  try {
    const response = await fetch(`/api/admin/time-table`, {
      method: "POST",
      body: JSON.stringify(timeTable),
    });
  } catch (err) {
    console.error("Error creating time table:", err);
    throw err; // Re-throw the error to be handled by the caller
  }
}

export {
  fetchSlotGroups,
  fetchSlotGroupDetails,
  fetchClassGrades,
  fetchSectionsForClassGrade,
  fetchSubjectsForClassGrade,
  fetchTeachersForSubject,
  fetchTimeTable,
  updateTimeTable,
  createTimeTable,
};
