"use client";

import { useEffect } from "react";
import axios from "axios";

const ViewCounter = ({ id }: { id: string }) => {
  useEffect(() => {
    if (id) {
      axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/visit/${id}`);
    }
  }, [id]);

  return null;
};
export default ViewCounter;
