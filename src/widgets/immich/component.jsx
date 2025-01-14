import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: immichData, error: immichError } = useWidgetAPI(widget);

  if (immichError || immichData?.statusCode === 401) {
    return <Container error={immichError ?? immichData} />;
  }

  if (!immichData) {
    return (
      <Container service={service}>
        <Block label="immich.users" />
        <Block label="immich.photos" />
        <Block label="immich.videos" />
        <Block label="immich.storage" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="immich.users" value={immichData.usageByUser.length} />
      <Block label="immich.photos" value={immichData.photos} />
      <Block label="immich.videos" value={immichData.videos} />
      <Block label="immich.storage"
        value={
          // backwards-compatible e.g. '9 GiB'
          immichData.usage.toString().toLowerCase().includes('b') ? 
          immichData.usage : 
          t("common.bytes", {
            value: immichData.usage,
            maximumFractionDigits: 1,
            binary: true // match immich
          })
        } />
    </Container>
  );
}
