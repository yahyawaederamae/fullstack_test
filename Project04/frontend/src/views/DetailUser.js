import { LinearProgress } from "@mui/joy";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

function DetailUser() {
  const params = useParams();
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/${params.id}`)
      .then((res) => {
        setData(res.data);
        setIsReady(true);
      });

    return () => {};
  }, [params]);

  if (!isReady) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  }

  return <div className='lg:mx-20'>DetailUser</div>;
}

export default DetailUser;