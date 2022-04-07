import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow
} from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import IconButtonTableCell from "@saleor/components/IconButtonTableCell";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { MenuFragment } from "@saleor/graphql";
import { DeleteIcon, makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { MenuListUrlSortField } from "@saleor/navigation/urls";
import { ListActions, ListProps, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import { getFooterColSpanWithBulkActions } from "@saleor/utils/tables";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface MenuListProps
  extends ListProps,
    ListActions,
    SortPage<MenuListUrlSortField> {
  menus: MenuFragment[];
  onDelete: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colItems: {
        width: 200
      },
      colTitle: {}
    },
    colAction: {
      width: 84
    },
    colItems: {
      textAlign: "right"
    },
    colTitle: {
      paddingLeft: 0
    },
    row: {
      cursor: "pointer"
    }
  }),
  { name: "MenuList" }
);

const numberOfColumns = 3;

const MenuList: React.FC<MenuListProps> = props => {
  const {
    settings,
    disabled,
    isChecked,
    menus,
    onDelete,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    pageInfo,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar
  } = props;

  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={menus}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCellHeader
            direction={
              sort.sort === MenuListUrlSortField.name
                ? getArrowDirection(sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(MenuListUrlSortField.name)}
            className={classes.colTitle}
          >
            <FormattedMessage id="jhh/D6" defaultMessage="Menu Title" />
          </TableCellHeader>
          <TableCellHeader
            direction={
              sort.sort === MenuListUrlSortField.items
                ? getArrowDirection(sort.asc)
                : undefined
            }
            textAlign="right"
            onClick={() => onSort(MenuListUrlSortField.items)}
            className={classes.colItems}
          >
            <FormattedMessage
              id="0nL1D6"
              defaultMessage="Items"
              description="number of menu items"
            />
          </TableCellHeader>
          <TableCell className={classes.colAction} />
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={getFooterColSpanWithBulkActions(menus, numberOfColumns)}
              settings={settings}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              onUpdateListSettings={onUpdateListSettings}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            menus,
            menu => {
              const isSelected = menu ? isChecked(menu.id) : false;

              return (
                <TableRow
                  hover={!!menu}
                  key={menu ? menu.id : "skeleton"}
                  onClick={menu && onRowClick(menu.id)}
                  className={classes.row}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(menu.id)}
                    />
                  </TableCell>
                  <TableCell className={classes.colTitle}>
                    {maybe<React.ReactNode>(() => menu.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colItems}>
                    {maybe<React.ReactNode>(
                      () => menu.items.length,
                      <Skeleton />
                    )}
                  </TableCell>
                  <IconButtonTableCell
                    className={classes.colAction}
                    disabled={disabled}
                    onClick={() => onDelete(menu.id)}
                  >
                    <DeleteIcon />
                  </IconButtonTableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="DWs4ba"
                    defaultMessage="No menus found"
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
MenuList.displayName = "MenuList";
export default MenuList;
