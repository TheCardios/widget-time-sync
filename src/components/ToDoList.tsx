
import { useState, useEffect } from 'react';
import { Plus, Check, X, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

const ToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    // Mock tasks for demonstration
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Review project documentation',
        completed: false,
        priority: 'high'
      },
      {
        id: '2',
        title: 'Call client about meeting',
        completed: false,
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Buy groceries',
        completed: true,
        priority: 'low'
      }
    ];
    setTasks(mockTasks);
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        priority: 'medium'
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setIsAddingTask(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-400';
      case 'medium': return 'border-l-yellow-400';
      case 'low': return 'border-l-green-400';
      default: return 'border-l-gray-400';
    }
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListTodo className="w-5 h-5 text-green-400" />
          <div>
            <h2 className="text-white font-semibold">Tasks</h2>
            <p className="text-white/60 text-sm">
              {incompleteTasks.length} remaining
            </p>
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={() => setIsAddingTask(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Task Input */}
      {isAddingTask && (
        <div className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            autoFocus
          />
          <Button
            size="sm"
            onClick={addTask}
            className="bg-green-600 hover:bg-green-700 text-white border-0"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setIsAddingTask(false);
              setNewTask('');
            }}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {/* Incomplete Tasks */}
        {incompleteTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg border-l-2 ${getPriorityColor(task.priority)} transition-all hover:bg-white/10`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="w-5 h-5 rounded border-2 border-white/30 flex items-center justify-center hover:border-green-400 transition-colors"
            >
              {task.completed && <Check className="w-3 h-3 text-green-400" />}
            </button>
            
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
              {task.title}
            </span>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <>
            <div className="pt-2 border-t border-white/10">
              <p className="text-white/40 text-xs font-medium mb-2">Completed ({completedTasks.length})</p>
            </div>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 bg-white/5 rounded-lg opacity-60"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-4 h-4 rounded border-2 border-green-400 flex items-center justify-center bg-green-400/20"
                >
                  <Check className="w-2 h-2 text-green-400" />
                </button>
                
                <span className="flex-1 text-sm line-through text-white/50">
                  {task.title}
                </span>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="w-4 h-4 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            ))}
          </>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-6 text-white/50">
            <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
