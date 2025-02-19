import React from "react";
import { Button, Card, CardContent } from "@mui/joy";

export default function ControlCard({ title }) {
  function startProgram() {
    window.alert("Program " + title + " is Start");
  }

  const restartProgram = (subtitle) => {
    window.alert("Program " + title + "is Restart" + subtitle);
  };

  const showData = () => {
    return (
      <div>
        <li>Hello</li>
        <li>World</li>
      </div>
    );
  };

  return (
    <Card className='m-4 rounded-md border'>
      <CardContent>
        <h4>{title}</h4>
        <div className='flex gap-2'>
          <Button onClick={() => startProgram()}>Start</Button>
          <Button color='success' onClick={() => restartProgram("world")}>
            Restart
          </Button>
          <Button color='danger'>Down</Button>
        </div>
        {showData()}
      </CardContent>
    </Card>
  );
}