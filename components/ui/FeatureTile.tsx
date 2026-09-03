import { Icon, type IconName } from "@/components/icons/Icon";
import { FeatureCard } from "@/components/ui/FeatureCard";

type Props = {
  title: string;
  body: string;
  icon: IconName;
};

export function FeatureTile({ title, body, icon }: Props) {
  return (
    <FeatureCard
      title={title}
      body={body}
      icon={<Icon name={icon} size={52} />}
    />
  );
}
