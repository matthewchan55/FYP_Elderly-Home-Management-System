import { AvatarGroup, Avatar } from "@mui/material";
import React from "react";
import FemaleElderly from "../../assets/female_elderly.png";
import MaleElderly from "../../assets/male_elderly.png";


export default function Avatars(props) {
  const { total, type } = props;

  return type === "elderly" ? (
    <AvatarGroup total={total}>
      <Avatar alt="Remy Sharp" src={MaleElderly} />
      <Avatar alt="Travis Howard" src={MaleElderly} />
      <Avatar alt="Agnes Walker" src={FemaleElderly} />
      <Avatar alt="Trevor Henderson" src={MaleElderly} />
    </AvatarGroup>
  ) : (
    <AvatarGroup total={total}>
      <Avatar
        alt="Remy Sharp"
        src="https://mui.com/static/images/avatar/1.jpg"
      />
      <Avatar
        alt="Travis Howard"
        src="https://mui.com/static/images/avatar/2.jpg"
      />
      <Avatar
        alt="Trevor Henderson"
        src="https://mui.com/static/images/avatar/5.jpg"
      />
    </AvatarGroup>
  );
}
