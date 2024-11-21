import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import styles from "./Modals.module.scss";
import krest from "../../assets/icons/krest.svg";


const Modals = (props) => {
  const toggleDrawer = () => {
    props.changeState(!props.state);
  };

  const close = () => {
    props.changeState(false);
  };

  const handleClick = (e) => {
    // Проверка, что клик был не внутри input
    const isInput1 = e.target.tagName.toLowerCase() === "input";
    const isInput2 = e.target.tagName.toLowerCase() === "form";
    const isInput3 = e.target.tagName.toLowerCase() === "p";
    const isInput4 = e.target.tagName.toLowerCase() === "div";
    const isInput5 = e.target.tagName.toLowerCase() === "button";

    if (!isInput1 && !isInput2 && !isInput3 && !isInput4 && !isInput5) {
      toggleDrawer();
    }
  };

  return (
    <div className={styles.modal}>
      <Drawer
        PaperProps={{
          sx: {
            borderRadius: "20px 20px 0px 0px",
            padding: "0px 0 0 0",
            borderTop: "10px solid transparent",
          },
        }}
        anchor="bottom"
        open={props.state}
        onClose={toggleDrawer}
      >
        <Box
          sx={{ width: "auto" }}
          role="presentation"
          onMouseDown={handleClick}
        >
          <List>
            <div className={styles.modal__inner}>
              <div className="container">
                <div className={styles.mainBlock}>
                  <h6>{props.title}</h6>
                  <button onClick={close}>
                    <img src={krest} alt="x" />
                  </button>
                </div>
                {props.children}
              </div>
            </div>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Modals;
