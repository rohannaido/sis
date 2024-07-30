import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="flex-1 overflow-auto p-4 md:p-6">
      Temp data
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Math</div>
              <div>
                <div className="font-medium">10th Grade</div>
                <div className="text-sm text-muted-foreground">
                  9:00 AM - 10:30 AM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">English</div>
              <div>
                <div className="font-medium">11th Grade</div>
                <div className="text-sm text-muted-foreground">
                  11:00 AM - 12:30 PM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Science</div>
              <div>
                <div className="font-medium">9th Grade</div>
                <div className="text-sm text-muted-foreground">
                  1:00 PM - 2:30 PM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">History</div>
              <div>
                <div className="font-medium">12th Grade</div>
                <div className="text-sm text-muted-foreground">
                  3:00 PM - 4:30 PM
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Art</div>
              <div>
                <div className="font-medium">8th Grade</div>
                <div className="text-sm text-muted-foreground">
                  9:00 AM - 10:30 AM
                </div>
              </div>
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
            <CardTitle>Teacher Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Name</div>
              <div>Jane Doe</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Subject</div>
              <div>Math, Science</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Employee ID</div>
              <div>54321</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Email</div>
              <div>jane.doe@example.com</div>
            </div>
            <div className="grid grid-cols-2 items-center gap-2">
              <div className="font-medium">Phone</div>
              <div>555-4321</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
