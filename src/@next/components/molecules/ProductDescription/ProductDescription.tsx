import React from "react";
import { FormattedMessage } from "react-intl";

import { RichTextContent } from "@components/atoms";

import * as S from "./styles";
import { IProps } from "./types";

enum TABS {
  Description,
  Specification,
}

export const ProductDescription: React.FC<IProps> = ({
  description = "",
  descriptionJson = "",
  attributes,
}: IProps) => {
  const [activeTab, setActiveTab] = React.useState<TABS>(TABS.Description);

  return (
<S.Wrapper>
<S.Tabs>
<S.TabTitle
  active={activeTab === TABS.Description}
  onMouseEnter={evt => {
    evt.stopPropagation();
    setActiveTab(TABS.Description);
  }}
  onClick={evt => {
    evt.stopPropagation();
    setActiveTab(TABS.Description);
  }}
>
          Description
        </S.TabTitle>
        <S.TabTitle
          active={activeTab === TABS.Specification}
          onMouseEnter={evt => {
            evt.stopPropagation();
            setActiveTab(TABS.Specification);
          }}
          onClick={evt => {
            evt.stopPropagation();
            setActiveTab(TABS.Specification);
          }}
        >
          Specification
        </S.TabTitle>
      </S.Tabs>
      {activeTab === TABS.Description &&
        (descriptionJson ? (
          <RichTextContent descriptionJson={descriptionJson} />
        ) : (
          <p>{description}</p>
        ))}
      {activeTab === TABS.Specification && (
        <S.AttributeList>
          {attributes &&
            attributes.map((attribute, index) => (
              <li key={index}>
                <S.AttributeName>{attribute.attribute.name}: </S.AttributeName>{" "}
                {attribute.values.map(value => value.name).join(", ")}
              </li>
            ))}
        </S.AttributeList>
      )}
    </S.Wrapper>
  );
};
