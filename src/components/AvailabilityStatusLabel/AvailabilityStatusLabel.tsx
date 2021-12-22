import { CollectionList_collections_edges_node_channelListings } from "@saleor/collections/types/CollectionList";
import StatusLabel from "@saleor/components/StatusLabel";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { ProductList_products_edges_node_channelListings } from "@saleor/products/types/ProductList";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

interface AvailabilityStatusLabelProps {
  channel:
    | CollectionList_collections_edges_node_channelListings
    | ProductList_products_edges_node_channelListings;
  messages: {
    published: MessageDescriptor;
    unpublished: MessageDescriptor;
    willBePublished: MessageDescriptor;
  };
}

export const AvailabilityStatusLabel = ({
  channel,
  messages
}: AvailabilityStatusLabelProps) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <StatusLabel
      label={intl.formatMessage(
        channel.publicationDate
          ? channel.isPublished
            ? messages.published
            : messages.willBePublished
          : messages.unpublished,
        {
          date: localizeDate(channel.publicationDate, "L")
        }
      )}
      status={
        channel.publicationDate
          ? channel.isPublished
            ? "success"
            : "alert"
          : "error"
      }
    />
  );
};

export default AvailabilityStatusLabel;
