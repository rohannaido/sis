import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentPage() {
  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      Temp data
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Monday</div>
              <div>
                <div className="font-medium">Math</div>
                <div className="text-sm text-muted-foreground">
                  9:00 AM - 10:30 AM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Tuesday</div>
              <div>
                <div className="font-medium">English</div>
                <div className="text-sm text-muted-foreground">
                  11:00 AM - 12:30 PM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Wednesday</div>
              <div>
                <div className="font-medium">Science</div>
                <div className="text-sm text-muted-foreground">
                  1:00 PM - 2:30 PM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Thursday</div>
              <div>
                <div className="font-medium">History</div>
                <div className="text-sm text-muted-foreground">
                  3:00 PM - 4:30 PM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Friday</div>
              <div>
                <div className="font-medium">Art</div>
                <div className="text-sm text-muted-foreground">
                  9:00 AM - 10:30 AM
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Math</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">English</div>
              <div>
                <div className="font-medium">Chapters</div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Science</div>
              <div>
                <div className="font-medium">Chapters</div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">History</div>
              <div>
                <div className="font-medium">Chapters</div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Art</div>
              <div>
                <div className="font-medium">Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Grades</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Math</div>
              <div className="text-lg font-medium">A-</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">English</div>
              <div className="text-lg font-medium">B+</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Science</div>
              <div className="text-lg font-medium">A</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">History</div>
              <div className="text-lg font-medium">B</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Art</div>
              <div className="text-lg font-medium">A+</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Days Present</div>
              <div className="text-lg font-medium">45</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Days Absent</div>
              <div className="text-lg font-medium">5</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Tardies</div>
              <div className="text-lg font-medium">3</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Name</div>
              <div>John Doe</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Grade</div>
              <div>10th</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Student ID</div>
              <div>12345</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Email</div>
              <div>john.doe@example.com</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Phone</div>
              <div>555-1234</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
