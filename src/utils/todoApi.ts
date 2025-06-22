
// Microsoft Graph API utilities for Microsoft To Do integration

interface TodoTask {
  id: string;
  title: string;
  status: 'notStarted' | 'inProgress' | 'completed';
  importance: 'low' | 'normal' | 'high';
  createdDateTime: string;
  dueDateTime?: {
    dateTime: string;
    timeZone: string;
  };
}

interface TodoList {
  id: string;
  displayName: string;
  isOwner: boolean;
  wellknownListName?: string;
}

interface GraphResponse<T> {
  value: T[];
  '@odata.nextLink'?: string;
}

export class TodoAPI {
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  async getLists(accessToken: string): Promise<TodoList[]> {
    try {
      const response = await fetch(`${this.baseUrl}/me/todo/lists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GraphResponse<TodoList> = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error fetching Todo lists:', error);
      return [];
    }
  }

  async getTasks(accessToken: string, listId: string): Promise<TodoTask[]> {
    try {
      const response = await fetch(`${this.baseUrl}/me/todo/lists/${listId}/tasks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GraphResponse<TodoTask> = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error fetching Todo tasks:', error);
      return [];
    }
  }

  async createTask(accessToken: string, listId: string, title: string): Promise<TodoTask | null> {
    try {
      const response = await fetch(`${this.baseUrl}/me/todo/lists/${listId}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          status: 'notStarted',
          importance: 'normal'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Todo task:', error);
      return null;
    }
  }

  async updateTask(accessToken: string, listId: string, taskId: string, updates: Partial<TodoTask>): Promise<TodoTask | null> {
    try {
      const response = await fetch(`${this.baseUrl}/me/todo/lists/${listId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating Todo task:', error);
      return null;
    }
  }

  async deleteTask(accessToken: string, listId: string, taskId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/me/todo/lists/${listId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting Todo task:', error);
      return false;
    }
  }

  formatTaskForWidget(task: TodoTask) {
    return {
      id: task.id,
      title: task.title,
      completed: task.status === 'completed',
      priority: this.mapPriorityFromTodo(task.importance),
      dueDate: task.dueDateTime?.dateTime
    };
  }

  private mapPriorityFromTodo(importance: string): 'low' | 'medium' | 'high' {
    switch (importance) {
      case 'high': return 'high';
      case 'normal': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }
}

export const todoAPI = new TodoAPI();
