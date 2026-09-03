import Image from "next/image";

import { Icon } from "@/components/icons/Icon";
import { ChassisFrame } from "@/components/ui/ChassisFrame";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/content";
import { img } from "@/lib/images.server";

type Props = {
  content: SiteContent["crucible"];
};

/**
 * Questions section — approved checklist + natural-size framed terrain
 * (sticky while the list scrolls).
 */
export function CrucibleQuestions({ content }: Props) {
  const asset = img("crucible-questions-terrain");

  return (
    <section className="section-y bg-ist-bg">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <div className="lg:sticky lg:top-24">
            <Reveal variant="fromLeft">
              <ChassisFrame as="figure" media inert>
                <Image
                  src={asset.src}
                  width={asset.width}
                  height={asset.height}
                  alt={content.questionsAlt}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="h-auto w-full"
                  priority={false}
                />
              </ChassisFrame>
            </Reveal>
          </div>

          <Reveal index={1} variant="fromRight" className="min-w-0">
            <h2 className="t-h2 text-balance text-ist-text">{content.questionsHeading}</h2>

            <ul className="mt-8 flex flex-col gap-4 sm:mt-10 sm:gap-5">
              {content.questions.map((question) => (
                <li key={question} className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-flex shrink-0 text-ist-accent-bright">
                    <Icon name="check" size={20} />
                  </span>
                  <p className="text-[1.02rem] leading-snug text-ist-text sm:text-[1.06rem]">
                    {question}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
