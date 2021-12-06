import { Button, Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";

interface MarketplaceProps {
  link?: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ link }) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <div className={classes.appContainer}>
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "SwISVH",
            defaultMessage: "Saleor Marketplace",
            description: "section header"
          })}
        />
        <CardContent className={classes.marketplaceContent}>
          {!!link ? (
            <>
              <Typography variant="body2">
                <FormattedMessage
                  id="LATpSE"
                  defaultMessage="Discover great free and paid apps in our Saleor Marketplace."
                  description="marketplace content"
                />
              </Typography>
              <Button color="primary" onClick={link}>
                <FormattedMessage
                  id="wxFwUW"
                  defaultMessage="Visit Marketplace"
                  description="marketplace button"
                />
              </Button>
            </>
          ) : (
            <Typography variant="body2">
              <FormattedMessage
                id="NskBjH"
                defaultMessage="Marketplace is coming soon"
                description="marketplace content"
              />
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

Marketplace.displayName = "Marketplace";
export default Marketplace;
