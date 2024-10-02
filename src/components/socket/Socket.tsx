"use client";

import { useEffect } from "react";
import {
  disconnectSocket,
  initiateSocketConnection,
} from "../active-users/socketClient";
import React from "react";

export default function Socket() {
  useEffect(() => {
    console.log("SDF");
    initiateSocketConnection();

    // return () => {
    //   disconnectSocket(); // Cleanup on unmount
    // };
  }, []);
  return <></>;
}
