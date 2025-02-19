import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Input,
  LinearProgress,
  Table,
} from "@mui/joy";
import axios from "axios";
import _ from "lodash";
import { useForm, Controller } from "react-hook-form";

import Footer from "./Components/Footer";
import Topbar from "./Components/Topbar";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const { control, handleSubmit } = useForm();

  const handleCreateUser = (data) => {
    console.log("data", data);
    setIsReady(false);
    axios
      .post(`${process.env.REACT_APP_API_URL}/user`, data)
      .then((res) => {
        axios.get(`${process.env.REACT_APP_API_URL}/user`).then((res) => {
          setUsers(res?.data?.rows);
          setIsReady(true);
        });
      })
      .catch((error) => {
        console.error("Error", error?.message);
      });
  };

  const getAllUser = () => {
    setIsReady(false);
    axios
      .get(`${process.env.REACT_APP_API_URL}/user`)
      .then((res) => {
        setUsers(res?.data?.rows);
        setIsReady(true);
        console.log("User ", res?.data?.rows);
      })
      .catch((error) => {
        console.error("Error", error?.message);
      });
  };

  useEffect(() => {
    getAllUser();
    return () => {};
  }, []);

  const handleDeleteUser = (userId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/user/${userId}`)
      .then((res) => {
        getAllUser();
      })
      .catch((error) => {
        alert(error?.message);
        console.error("Error", error?.message);
      });
  };

  if (!isReady) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  }

  return (
    <div>
      <Topbar appTitle='IARC Devboard' />{" "}
      <div className='min-h-screen'>
        <div className='flex justify-center  flex-wrap'>
          <div className='lg:w-3/4 '>
            <div className='my-1 font-semibold text-lg'>เพิ่มพนักงานใหม่</div>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit(handleCreateUser)}>
                  <div>ชื่อ</div>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='ชื่อพนักงาน' />
                    )}
                  />
                  <div>แผนก</div>
                  <Controller
                    name='department'
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder='แผนก' />
                    )}
                  />
                  <div>
                    <Button type='submit'>บันทึก</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className='lg:w-3/4'>
            <Card>
              <CardContent>
                <div>Search Box</div>
                <Input
                  placeholder='Input Some Search Word'
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div>
                  You Search <span className='text-blue-500'>{searchTerm}</span>
                </div>
              </CardContent>
            </Card>
            <div>
              <h3 className='font-bold'>User List</h3>
              <Table>
                <thead>
                  <tr>
                    <th>ลำดับที่</th>
                    <th>ชื่อ</th>
                    <th>แผนก</th>
                    <th>ดำเนินการ</th>
                  </tr>
                </thead>
                {_.map(users, (eachUser, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{eachUser?.name}</td>
                    <td>{eachUser?.department}</td>
                    <td>
                      <Button
                        color='danger'
                        onClick={() => handleDeleteUser(eachUser?._id)}
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;