import {
  Button,
  Card,
  IconButton,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { makeStyles } from "@saleor/macaw-ui";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";

const useStyles = makeStyles(
  theme => ({
    colActions: {
      "&:last-child": {
        paddingRight: 0
      },
      width: `calc(76px + ${theme.spacing(0.5)})`
    },
    colName: {
      paddingLeft: 0,
      width: "auto"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colPublished: {
      width: 200
    },
    colType: {
      width: 200
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "CollectionProducts" }
);

export interface CollectionProductsProps extends PageListProps, ListActions {
  collection: CollectionDetails_collection;
  channelsCount: number;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
}

const numberOfColumns = 5;

const CollectionProducts: React.FC<CollectionProductsProps> = props => {
  const {
    channelsCount,
    collection,
    disabled,
    onAdd,
    onNextPage,
    onPreviousPage,
    onProductUnassign,
    onRowClick,
    pageInfo,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={
          !!collection ? (
            intl.formatMessage(
              {
                id: "/dnWE8",
                defaultMessage: "Products in {name}",
                description: "products in collection"
              },
              {
                name: maybe(() => collection.name, "...")
              }
            )
          ) : (
            <Skeleton />
          )
        }
        toolbar={
          <Button
            data-test-id="add-product"
            disabled={disabled}
            variant="text"
            color="primary"
            onClick={onAdd}
          >
            <FormattedMessage
              id="scHVdW"
              defaultMessage="Assign product"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable className={classes.table}>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={mapEdgesToItems(collection?.products)}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <span className={classes.colNameLabel}>
              <FormattedMessage
                id="6AMFki"
                defaultMessage="Name"
                description="product name"
              />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage
              id="k+HcTv"
              defaultMessage="Type"
              description="product type"
            />
          </TableCell>
          <TableCell className={classes.colPublished}>
            <FormattedMessage
              id="Oe62bR"
              defaultMessage="Availability"
              description="product availability"
            />
          </TableCell>
          <TableCell className={classes.colActions} />
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              hasNextPage={pageInfo?.hasNextPage}
              onNextPage={onNextPage}
              hasPreviousPage={pageInfo?.hasPreviousPage}
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            mapEdgesToItems(collection?.products),
            product => {
              const isSelected = product ? isChecked(product.id) : false;

              return (
                <TableRow
                  className={classes.tableRow}
                  hover={!!product}
                  onClick={!!product ? onRowClick(product.id) : undefined}
                  key={product ? product.id : "skeleton"}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCellAvatar
                    className={classes.colName}
                    thumbnail={maybe(() => product.thumbnail.url)}
                  >
                    {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                  </TableCellAvatar>
                  <TableCell className={classes.colType}>
                    {maybe<React.ReactNode>(
                      () => product.productType.name,
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {product && !product?.channelListings?.length ? (
                      "-"
                    ) : product?.channelListings !== undefined ? (
                      <ChannelsAvailabilityDropdown
                        allChannelsCount={channelsCount}
                        channels={product?.channelListings}
                      />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <IconButton
                      disabled={!product}
                      onClick={event => onProductUnassign(product.id, event)}
                    >
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell />
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="Q1Uzbb"
                    defaultMessage="No products found"
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
