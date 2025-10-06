import React from "react";
import { ApiResponse, IdeaRow, Idea, VoteStatus } from "@root/types";
import { IdeaItem } from "@features/IdeaItem";
import "./IdeaList.scss";
import { apiClient } from "@features/apiClient";

export const IdeaList = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [items, setItems] = React.useState<Idea[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);

    // Запрашиваем идеи (только поля БД)
    const ideasResult: ApiResponse<IdeaRow[]> = await apiClient.get("/ideas");
    
    if (!ideasResult.success || !ideasResult.data) {
      setError(ideasResult.error || "Ошибка загрузки идей");
      setIsLoading(false);
      return;
    }

    const ideas = ideasResult.data;
    
    // Если есть идеи, запрашиваем статус голосов
    if (ideas.length > 0) {
      const ideaIds = ideas.map(idea => idea.id);
      const ideaIdsJson = JSON.stringify(ideaIds);
      const voteStatusResult: ApiResponse<VoteStatus[]> = await apiClient.get(`/votes/status?ideaIds=${encodeURIComponent(ideaIdsJson)}`);
      
      if (voteStatusResult.success && voteStatusResult.data) {
        // Объединяем данные: создаем мап статусов голосов
        const voteStatusMap = new Map(
          voteStatusResult.data.map(status => [status.ideaId, status.canVoting])
        );
        
        // Объединяем идеи со статусами голосов
        const ideasWithVoteStatus: Idea[] = ideas.map(idea => ({
          ...idea,
          canVoting: voteStatusMap.get(idea.id) ?? true // по умолчанию можно голосовать
        }));
        
        setItems(ideasWithVoteStatus);
      } else {
        // Если не удалось получить статус голосов, показываем идеи без статуса
        setItems(ideas.map(idea => ({ ...idea, canVoting: true })));
      }
    } else {
      setItems([]);
    }

    setIsLoading(false);
  };

  const handleVoteSuccess = (ideaId: number) => {
    // Обновляем статус голосования для конкретной идеи
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === ideaId 
          ? { ...item, canVoting: false }
          : item
      )
    );
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  if (isLoading) {
    return (
      <div className="IdeaList-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Загрузка идей...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return error;
  }

  return (
    <div className="IdeaList">
      {items.map((item, index) => (
        <IdeaItem 
          item={item} 
          key={index} 
          onVoteSuccess={handleVoteSuccess}
        />
      ))}
    </div>
  );
};
