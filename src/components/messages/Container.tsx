import React from "react";

import { useStyles } from "./styles";

interface ContainerProps {
  children: React.ReactNodeArray;
}

const Container = ({ children }: ContainerProps) => {
  const classes = useStyles({});
  return (
    !!children.length && <div className={classes.container}>{children}</div>
  );
};

export default Container;
