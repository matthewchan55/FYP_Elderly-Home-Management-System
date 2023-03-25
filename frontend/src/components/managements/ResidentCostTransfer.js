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
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CardActions, CardContent } from "@mui/material";
import { useState, useMemo, useEffect} from "react";
import { useSubmit } from "../../hook/useSubmit";

import useAlert from "../../hook/useAlert";
import SmallAlert from "../SmallAlert";
import FinanceServiceCost from "../forms/ManagementForm/FinanceServiceCost";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const ResidentCostTransfer = ({ subscribedItems, path}) => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState();
  const [right, setRight] = useState(subscribedItems);
  const [createService, setCreateService] = useState(false);
  const [selectedServiceCost, setSelectedServiceCost] = useState("");
  const [show, setShow] = useState(false)

  const fetchServiceCost = async () => {
    // left items
    const resp = await fetch("/api/management/finance/servicecost");
    const respData = await resp.json();

    if (resp.ok) {
      setLeft(respData);
      selectedServiceCost==="" && setSelectedServiceCost(respData[0]);
    }
  };

  useEffect(() => {
    fetchServiceCost();
  }, []);

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

  const handlePenClick = (value) => {
    setSelectedServiceCost(value);
    setCreateService(false);

  };

  const saveServicesItems = async () => {
    // update servicecost
    await submit(path, { itemSubscription: right }, "PATCH");
    show && setOpen(true);
  };

  useMemo(() => {
    saveServicesItems()
    setShow(true)
  }, [right])

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
            width: "295px",
            height: "36vh",
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
                    items === left && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handlePenClick(value)}
                      >
                        <EditIcon />
                      </IconButton>
                    )
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

      <CardActions sx={{ justifyContent: "flex-end" }}>
        {items === right ? (
          <Button onClick={saveServicesItems}>Save change</Button>
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => setCreateService(true)}
            sx={{ borderRadius: "50%", fontSize: 20 }}
          >
            +
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    left && right && (
      <>
        <Grid container alignItems={"center"}>
          <Grid item xs={5} md={3}>
            {customList("Total Services", left)}
          </Grid>
          <Grid item xs md={1}>
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
          <Grid item xs={5} md={3}>
            {customList("Selected services for elderly", right)}
          </Grid>
          <Divider orientation="vertical"  width="5%" flexItem/>
          <Grid item xs={12} md={4} ml={3}>
            {createService ? (
              <FinanceServiceCost service={""} />
            ) : (
              selectedServiceCost && (
                <FinanceServiceCost
                  service={selectedServiceCost}
                  right={right}
                  setRight={setRight}
                />
              )
            )}
          </Grid>
        </Grid>

        <SmallAlert
          error={error}
          open={open}
          onClose={handleClose}
          title="Update service items for elderly successfully!"
        />
      </>
    )
  );
};

export default ResidentCostTransfer;
