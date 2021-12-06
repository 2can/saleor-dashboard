import { Button, Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import ExternalLink from "@saleor/components/ExternalLink";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import settingsIcon from "../../../../assets/images/settings-icon.svg";
import supportIcon from "../../../../assets/images/support-icon.svg";
import { useStyles } from "../../styles";
import { App_app } from "../../types/App";
import DeactivatedText from "../DeactivatedText";

export interface AppDetailsPageProps {
  loading: boolean;
  data: App_app;
  navigateToAppSettings: () => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onBack: () => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  data,
  loading,
  navigateToAppSettings,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onBack
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.apps)}
      </Backlink>
      <PageHeader
        title={
          <>
            {data?.name} {!data?.isActive && <DeactivatedText />}
          </>
        }
      >
        <Button
          href={data?.homepageUrl}
          color="primary"
          variant="contained"
          data-tc="open-app"
          target="_blank"
        >
          <FormattedMessage
            id="HtfL5/"
            defaultMessage="Open App"
            description="button"
          />
        </Button>
      </PageHeader>
      <div className={classes.appHeader}>
        {data ? (
          <div className={classes.appHeaderLinks}>
            <ExternalLink
              className={classes.headerLinkContainer}
              href={data.supportUrl}
              target="_blank"
            >
              <img src={supportIcon} alt="" />
              <FormattedMessage
                id="Gjb6eq"
                defaultMessage="Get Support"
                description="link"
              />
            </ExternalLink>
            <Button
              color="primary"
              className={classes.headerLinkContainer}
              onClick={navigateToAppSettings}
            >
              <img src={settingsIcon} alt="" />

              <FormattedMessage
                id="89PSdB"
                defaultMessage="Edit settings"
                description="link"
              />
            </Button>
            <Button
              variant="text"
              color="primary"
              className={classes.headerLinkContainer}
              disableFocusRipple
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
              <img src={activateIcon} alt="" />
              {data?.isActive ? (
                <FormattedMessage
                  id="whTEcF"
                  defaultMessage="Deactivate"
                  description="link"
                />
              ) : (
                <FormattedMessage
                  id="P5twxk"
                  defaultMessage="Activate"
                  description="link"
                />
              )}
            </Button>
          </div>
        ) : (
          <Skeleton />
        )}
        <div className={classes.hr} />
      </div>

      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "jDIRQV",
            defaultMessage: "About this app",
            description: "section header"
          })}
        />
        <CardContent>
          {!loading ? <ReactMarkdown source={data?.aboutApp} /> : <Skeleton />}
        </CardContent>
      </Card>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "VsGcdP",
            defaultMessage: "App permissions",
            description: "section header"
          })}
        />
        <CardContent>
          {!loading ? (
            <>
              <Typography>
                <FormattedMessage
                  id="7oQUMG"
                  defaultMessage="This app has permissions to:"
                  description="apps about permissions"
                />
              </Typography>
              {!!data?.permissions?.length && (
                <ul className={classes.permissionsContainer}>
                  {data?.permissions?.map(perm => (
                    <li key={perm.code}>{perm.name}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <CardSpacer />

      <Card>
        <CardTitle
          title={intl.formatMessage({
            id: "a55zOn",
            defaultMessage: "Data privacy",
            description: "section header"
          })}
        />
        <CardContent>
          {!loading ? (
            <>
              <Typography>{data?.dataPrivacy}</Typography>
              <ExternalLink
                className={classes.linkContainer}
                href={data?.dataPrivacyUrl}
                target="_blank"
              >
                <FormattedMessage
                  id="Go50v2"
                  defaultMessage="View this app’s privacy policy"
                  description="app privacy policy link"
                />
              </ExternalLink>
            </>
          ) : (
            <Skeleton />
          )}
        </CardContent>
      </Card>
      <CardSpacer />
    </Container>
  );
};

AppDetailsPage.displayName = "AppDetailsPage";
export default AppDetailsPage;
