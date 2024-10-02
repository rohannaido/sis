"use client";

import { getSocket } from "@/components/active-users/socketClient";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const activeUsers = users.filter((user) => user.isActive);

  useEffect(() => {
    const socket = getSocket();
    console.log("SOCKET", socket);

    if (socket !== null) {
      (socket as WebSocket)!.send(
        JSON.stringify({ type: "GET_USER_ACTIVITY_LIST" })
      );

      (socket as WebSocket)!.onmessage = (event: MessageEvent<any>) => {
        console.log("ON MESSAGE");
        const message = JSON.parse(event.data);
        if (message) {
          if (message.type === "USER_ACTIVITY_LIST") {
            setUsers(
              message.data?.map((user: any) => ({
                ...user,
                id: user.userId,
                name: user.userId,
                isActive: true,
                lastActive: new Date(),
              }))
            );
          } else if (message.type === "USER_ACTIVITY") {
            setUsers((prevUsers) => {
              const index = prevUsers.findIndex(
                (user) => user.id === message.data.userId
              );
              const updatedUsers = [...prevUsers];
              if (index !== -1) {
                prevUsers[index].status = message.data.status;
                prevUsers[index].lastActive = new Date();
                prevUsers[index].isActive =
                  message.data.status === "ONLINE" ? true : false;
                updatedUsers[index] = prevUsers[index];
              } else {
                const newUser = {
                  id: message.data.userId,
                  name: message.data.userId,
                  status: message.data.status,
                  isActive: message.data.status === "ONLINE" ? true : false,
                  lastActive: new Date(),
                };
                updatedUsers.push(newUser);
              }
              return updatedUsers;
            });
          }
        }
      };
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Users</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeUsers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {users.map((user) => (
              <div
                className="flex items-center justify-between py-2"
                key={user.id}
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    Last active: {user.lastActive.toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
