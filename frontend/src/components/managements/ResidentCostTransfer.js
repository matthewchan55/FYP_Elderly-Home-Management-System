import {
  Grid,
  List,
  Card,
  CardHeader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CardActions, CardContent } from "@mui/material";
import { useState } from "react";
import { useSubmit } from "../../hook/useSubmit";
import useAlert from "../../hook/useAlert";
import SmallAlert from "../SmallAlert";
import { Controls } from "../controls/Controls";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const ResidentCostTransfer = ({ total, subscribedItems, path, setService }) => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(total);
  const [right, setRight] = useState(subscribedItems);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleLeftCheckedItem = (lc) => {
    const result = lc.map(({ serviceName, serviceCost }) => {
      return { item: serviceName, charge: serviceCost, payment: 0 };
    });
    return result;
  };

  const handleCheckedRight = () => {
    const customize = handleLeftCheckedItem(leftChecked);
    setRight(right.concat(customize));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedDelete = () => {
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const { submit, error } = useSubmit();
  const { open, setOpen, handleClose } = useAlert();

  const saveServicesItems = async () => {
    await submit(path, { itemSubscription: right }, "PATCH");
    setOpen(true);
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <CardContent>
        <List
          sx={{
            width: items===left ? 320: 280,
            height: items === left ? "40vh" : "36vh",
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.length > 0 &&
            items.map((value, idx) => {
              const labelId = `transfer-list-all-item-${value}-label`;

              return (
                <ListItem
                  key={value.serviceName}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                  secondaryAction={
                    items===left && 
                    <IconButton edge="end" aria-label="delete" onClick={() => setService(value)}>
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon key={idx}>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    key={value.serviceName}
                    id={labelId}
                    primary={`${value.serviceName || value.item}`}
                  />
                </ListItem>
              );
            })}
        </List>
      </CardContent>

      <CardActions>
        {items === right && (
          <Button onClick={saveServicesItems}>Save change</Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <>
      <Grid container spacing={2} alignItems={"center"}>
        <Grid item>{customList("Total Services", left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0 || rightChecked.length > 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              color="error"
              onClick={handleCheckedDelete}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              x
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList("Selected services for elderly", right)}</Grid>
      </Grid>

      <SmallAlert
        error={error}
        open={open}
        onClose={handleClose}
        title="Update elderly service items successfully!"
      />
    </>
  );
};

export default ResidentCostTransfer;
