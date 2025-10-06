import React from "react";
import { ApiResponse, Idea, Vote } from "@root/types";
/*import ImagePlaceholder from "../../images/no-image.svg";*/
import "./IdeaItem.scss";
import { apiClient } from "@features/apiClient";
import { Button } from "@shared/Button";
import { ErrorMessage } from "@shared/ErrorMessage";
import { SuccessMessage } from "@shared/SuccessMessage";

type IdeaItemProps = {
  item: Idea;
  onVoteSuccess?: (ideaId: number) => void; // колбэк для обновления статуса голосования
};

export const IdeaItem = (props: IdeaItemProps) => {
  const { item, onVoteSuccess } = props;
  const [error, setError] = React.useState<string | null>(null);
  const [isProgress, setIsProgress] = React.useState(false);
  const { name, canVoting } = item;

  const onClick = async () => {
    setIsProgress(true);
    setError(null);

    const res: ApiResponse<Vote> = await apiClient.post("/votes", {
      ideaId: item.id,
    });

    if (res.success && res.data?.ideaId === item.id) {
      // Уведомляем родительский компонент об успешном голосовании
      onVoteSuccess?.(item.id);
    } else if (res.error) {
      setError(res.error);
    }

    setIsProgress(false);
  };

  return (
    <div className="IdeaItem">
      {name}
      {canVoting ? (
        <Button
          variant="primary"
          onClick={onClick}
          disabled={isProgress || !!error}
        >
          Голосовать
        </Button>
      ) : (
        <SuccessMessage text="голос учтен" />
      )}
      {error && <ErrorMessage text={error} />}
    </div>
  );
};
