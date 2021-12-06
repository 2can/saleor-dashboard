import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import { getCommonFormFieldErrorMessage } from "@saleor/utils/errors/common";
import { defineMessages, IntlShape } from "react-intl";

export const giftCardSettingsPageMessages = defineMessages({
  title: {
    id: "BRQf9m",
    defaultMessage: "Gift Cards Settings",
    description: "header"
  }
});

export function getGiftCardSettingsErrorMessage(
  error: Omit<GiftCardSettingsErrorFragment, "__typename"> | undefined,
  intl: IntlShape
): string {
  return getCommonFormFieldErrorMessage(error, intl);
}
