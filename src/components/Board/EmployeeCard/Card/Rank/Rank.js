import React, { memo, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import TypeBtn from "../../../../TypeBtn";
import RankCard from "../../../../Statistics/RankCard/RankCard";
import Loader from "../../../../UI/Loader";

const Rank = memo((props) => {
  const {
    expanded,
    onChangeAccordion,
    classes,
    type,
    data,
    changeDataType,
    isLoading,
  } = props;

  const rankCard = isLoading ? (
    <Loader size="small" />
  ) : (
    <RankCard data={data} />
  );

  return (
    <Accordion
      square
      expanded={expanded === "panel2"}
      onChange={onChangeAccordion("panel2")}
      className={expanded === "panel2" ? classes.whole : null}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="pane6bh-content"
        id="panel2bh-header"
      >
        <Typography className={classes.heading}> 종합 직원 랭킹</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {expanded !== "panel2" ? null : (
          <AccordionDetails className={classes.AccordionDetails}>
            <Grid
              container
              item
              spacing={3}
              direction="column"
              className={classes.rankCardWrapper}
            >
              <Grid item className={classes.rankTypeBtn}>
                <TypeBtn
                  handleClick={changeDataType}
                  expanded={expanded}
                  selected={type ? type : "default"}
                />
              </Grid>
              <Grid item>{rankCard}</Grid>
            </Grid>
          </AccordionDetails>
        )}
      </AccordionDetails>
    </Accordion>
  );
});

export default Rank;
