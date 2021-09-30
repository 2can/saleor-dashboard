import { IFilter, IFilterElement } from "@saleor/components/Filter";
import { maybe } from "@saleor/misc";
import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { GiftCardFilterInput } from "@saleor/types/globalTypes";
import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getMinMaxQueryParam,
  getMultipleValueQueryParam,
  getSingleValueQueryParam
} from "@saleor/utils/filters";
import {
  createAutocompleteField,
  createNumberField,
  createOptionsField
} from "@saleor/utils/filters/fields";
import {
  mapNodeToChoice,
  mapPersonNodeToChoice,
  mapSingleValueNodeToChoice
} from "@saleor/utils/maps";
import { defineMessages, IntlShape } from "react-intl";

import { GiftCardListUrlQueryParams } from "../types";
import {
  GiftCardListFilterKeys,
  GiftCardListFilterOpts,
  GiftCardListUrlFilters,
  GiftCardListUrlFiltersEnum,
  GiftCardStatusFilterEnum,
  SearchWithFetchMoreProps
} from "./types";

export const GIFT_CARD_FILTERS_KEY = "giftCardFilters";

interface GiftCardFilterOptsProps {
  params: GiftCardListUrlFilters;
  currencies: string[];
  loadingCurrencies: boolean;
  products: SearchProducts_search_edges_node[];
  productSearchProps: SearchWithFetchMoreProps;
  customers: SearchCustomers_search_edges_node[];
  customerSearchProps: SearchWithFetchMoreProps;
  tag: string[];
  tagSearchProps: SearchWithFetchMoreProps;
}

export const getFilterOpts = ({
  params,
  currencies,
  loadingCurrencies,
  products,
  productSearchProps,
  customers,
  customerSearchProps,
  tag,
  tagSearchProps
}: GiftCardFilterOptsProps): GiftCardListFilterOpts => ({
  currency: {
    active: !!params?.currency,
    value: params?.currency,
    choices: mapSingleValueNodeToChoice(currencies),
    displayValues: mapSingleValueNodeToChoice(currencies),
    initialSearch: "",
    loading: loadingCurrencies
  },
  product: {
    active: !!params?.product,
    value: params?.product,
    choices: mapNodeToChoice(products),
    displayValues: mapSingleValueNodeToChoice(products),
    initialSearch: "",
    hasMore: productSearchProps.hasMore,
    loading: productSearchProps.loading,
    onFetchMore: productSearchProps.onFetchMore,
    onSearchChange: productSearchProps.onSearchChange
  },
  usedBy: {
    active: !!params?.usedBy,
    value: params?.usedBy,
    choices: mapPersonNodeToChoice(customers),
    displayValues: mapPersonNodeToChoice(customers),
    initialSearch: "",
    hasMore: customerSearchProps.hasMore,
    loading: customerSearchProps.loading,
    onFetchMore: customerSearchProps.onFetchMore,
    onSearchChange: customerSearchProps.onSearchChange
  },
  tag: {
    active: !!params?.tag,
    value: dedupeFilter(params?.tag || []),
    choices: mapSingleValueNodeToChoice(tag),
    displayValues: mapSingleValueNodeToChoice(tag),
    initialSearch: "",
    hasMore: tagSearchProps.hasMore,
    loading: tagSearchProps.loading,
    onFetchMore: tagSearchProps.onFetchMore,
    onSearchChange: tagSearchProps.onSearchChange
  },
  initialBalanceAmount: {
    active: maybe(
      () =>
        [params.initialBalanceAmountFrom, params.initialBalanceAmountTo].some(
          field => field !== undefined
        ),
      false
    ),
    value: {
      max: maybe(() => params.initialBalanceAmountTo, ""),
      min: maybe(() => params.initialBalanceAmountFrom, "")
    }
  },
  currentBalanceAmount: {
    active: maybe(
      () =>
        [params.currentBalanceAmountFrom, params.currentBalanceAmountTo].some(
          field => field !== undefined
        ),
      false
    ),
    value: {
      max: maybe(() => params.currentBalanceAmountTo, ""),
      min: maybe(() => params.currentBalanceAmountFrom, "")
    }
  },
  status: {
    active: !!params?.status,
    value: params?.status
  }
});

export function getFilterQueryParam(
  filter: IFilterElement<GiftCardListFilterKeys>
): GiftCardListUrlFilters {
  const { name } = filter;

  const {
    initialBalanceAmount,
    currentBalanceAmount,
    tag,
    currency,
    usedBy,
    product,
    status
  } = GiftCardListFilterKeys;

  switch (name) {
    case currency:
    case status:
      return getSingleValueQueryParam(filter, name);

    case tag:
    case product:
    case usedBy:
      return getMultipleValueQueryParam(filter, name);

    case initialBalanceAmount:
      return getMinMaxQueryParam(
        filter,
        GiftCardListUrlFiltersEnum.initialBalanceAmountFrom,
        GiftCardListUrlFiltersEnum.initialBalanceAmountTo
      );

    case currentBalanceAmount:
      return getMinMaxQueryParam(
        filter,
        GiftCardListUrlFiltersEnum.currentBalanceAmountFrom,
        GiftCardListUrlFiltersEnum.currentBalanceAmountTo
      );
  }
}

const messages = defineMessages({
  balanceAmountLabel: {
    defaultMessage: "Amount",
    description: "amount filter label"
  },
  tagLabel: {
    defaultMessage: "Tags",
    description: "tag filter label"
  },
  currencyLabel: {
    defaultMessage: "Currency",
    description: "currency filter label"
  },
  productLabel: {
    defaultMessage: "Product",
    description: "product filter label"
  },
  usedByLabel: {
    defaultMessage: "Used by",
    description: "used by filter label"
  },
  statusLabel: {
    defaultMessage: "Status",
    description: "status filter label"
  },
  enabledOptionLabel: {
    defaultMessage: "Enabled",
    description: "enabled status option label"
  },
  disabledOptionLabel: {
    defaultMessage: "Disabled",
    description: "disabled status option label"
  },
  initialBalanceLabel: {
    defaultMessage: "Initial balance",
    description: "initial balance filter label"
  },
  currentBalanceLabel: {
    defaultMessage: "Current balance",
    description: "current balance filter label"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: GiftCardListFilterOpts
): IFilter<GiftCardListFilterKeys> {
  return [
    {
      active: opts.initialBalanceAmount.active,
      ...createNumberField(
        GiftCardListFilterKeys.initialBalanceAmount,
        intl.formatMessage(messages.balanceAmountLabel),
        opts.initialBalanceAmount.value
      )
    },

    {
      active: opts.currentBalanceAmount.active,
      required: true,
      ...createNumberField(
        GiftCardListFilterKeys.currentBalanceAmount,
        intl.formatMessage(messages.balanceAmountLabel),
        opts.currentBalanceAmount.value
      )
    },
    {
      active: opts.currency.active,
      ...createAutocompleteField(
        GiftCardListFilterKeys.currency,
        intl.formatMessage(messages.currencyLabel),
        [opts.currency.value],
        opts.currency.displayValues,
        false,
        opts.currency.choices,
        {
          hasMore: opts.currency.hasMore,
          initialSearch: "",
          loading: opts.currency.loading,
          onFetchMore: opts.currency.onFetchMore,
          onSearchChange: opts.currency.onSearchChange
        }
      )
    },
    {
      active: opts.tag.active,
      ...createAutocompleteField(
        GiftCardListFilterKeys.tag,
        intl.formatMessage(messages.tagLabel),
        opts.tag.value,
        opts.tag.displayValues,
        true,
        opts.tag.choices,
        {
          hasMore: opts.tag.hasMore,
          initialSearch: "",
          loading: opts.tag.loading,
          onFetchMore: opts.tag.onFetchMore,
          onSearchChange: opts.tag.onSearchChange
        }
      )
    },
    {
      active: opts.product.active,
      ...createAutocompleteField(
        GiftCardListFilterKeys.product,
        intl.formatMessage(messages.productLabel),
        [opts.product.value],
        opts.product.displayValues,
        true,
        opts.product.choices,
        {
          hasMore: opts.product.hasMore,
          initialSearch: "",
          loading: opts.product.loading,
          onFetchMore: opts.product.onFetchMore,
          onSearchChange: opts.product.onSearchChange
        }
      )
    },
    {
      active: opts.usedBy.active,
      ...createAutocompleteField(
        GiftCardListFilterKeys.usedBy,
        intl.formatMessage(messages.usedByLabel),
        [opts.usedBy.value],
        opts.usedBy.displayValues,
        false,
        opts.usedBy.choices,
        {
          hasMore: opts.usedBy.hasMore,
          initialSearch: "",
          loading: opts.usedBy.loading,
          onFetchMore: opts.usedBy.onFetchMore,
          onSearchChange: opts.usedBy.onSearchChange
        }
      )
    },
    {
      ...createOptionsField(
        GiftCardListFilterKeys.status,
        intl.formatMessage(messages.statusLabel),
        [opts.status.value],
        false,
        [
          {
            label: intl.formatMessage(messages.enabledOptionLabel),
            value: GiftCardStatusFilterEnum.enabled
          },
          {
            label: intl.formatMessage(messages.disabledOptionLabel),
            value: GiftCardStatusFilterEnum.disabled
          }
        ]
      ),
      active: opts.status.active
    }
  ];
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<GiftCardListUrlFilters>(GIFT_CARD_FILTERS_KEY);

export const {
  areFiltersApplied,
  getActiveFilters,
  getFiltersCurrentTab
} = createFilterUtils<GiftCardListUrlQueryParams, GiftCardListUrlFilters>(
  GiftCardListUrlFiltersEnum
);

export function getFilterVariables({
  status,
  tag,
  usedBy,
  product,
  currency,
  currentBalanceAmountTo,
  currentBalanceAmountFrom,
  initialBalanceAmountTo,
  initialBalanceAmountFrom
}: GiftCardListUrlQueryParams): GiftCardFilterInput {
  return {
    isActive: status === "enabled" ? true : false,
    tags: tag,
    usedBy,
    products: product,
    currency,
    currentBalance:
      currentBalanceAmountFrom && currentBalanceAmountTo
        ? {
            gte: parseFloat(currentBalanceAmountFrom),
            lte: parseFloat(currentBalanceAmountTo)
          }
        : undefined,
    initialBalance:
      initialBalanceAmountFrom && initialBalanceAmountTo
        ? {
            gte: parseFloat(initialBalanceAmountFrom),
            lte: parseFloat(initialBalanceAmountTo)
          }
        : undefined
  };
}