import { Icon, type IconName } from "@/components/icons/Icon";
import { FeatureCard } from "@/components/ui/FeatureCard";

type Props = {
  /** Mono key — STORE / ROUTE / ADAPT / DELIVER and the Crucible equivalents. */
  step: string;
  title: string;
  body: string;
  icon: IconName;
};

export function StepCard({ step, title, body, icon }: Props) {
  return (
    <FeatureCard
      title={title}
      body={body}
      eyebrow={step}
      icon={<Icon name={icon} size={52} />}
    />
  );
}
