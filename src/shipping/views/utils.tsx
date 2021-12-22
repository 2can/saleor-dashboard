import { ShippingMethodFragment_postalCodeRules } from "@saleor/fragments/types/ShippingMethodFragment";
import { MinMax } from "@saleor/types";
import { PostalCodeRuleInclusionTypeEnum } from "@saleor/types/globalTypes";

import { ShippingZone_shippingZone_shippingMethods_postalCodeRules } from "../types/ShippingZone";

export const filterPostalCodes = (
  postalCodes: ShippingZone_shippingZone_shippingMethods_postalCodeRules[],
  codeToFilterOut: ShippingMethodFragment_postalCodeRules
) =>
  postalCodes.filter(
    rule =>
      rule.start !== codeToFilterOut.start && rule.end !== codeToFilterOut.end
  );

export const getPostalCodeRuleByMinMax = ({ min, max }: MinMax) => ({
  start,
  end
}: ShippingZone_shippingZone_shippingMethods_postalCodeRules) =>
  start === min && end === max;

export const getRuleObject = (
  rule: MinMax,
  inclusionType: PostalCodeRuleInclusionTypeEnum
) => ({
  __typename: undefined,
  end: rule.max,
  id: undefined,
  inclusionType,
  start: rule.min
});
