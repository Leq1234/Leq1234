import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/layout';

type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 15;
const INIT_SPEED = 180;
const MIN_SPEED = 80;

const DELTAS: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
};

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

const ARROW_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right'
};

const keyOf = (x: number, y: number): string => `${x},${y}`;

export default function SnakeGamePage() {
  const [snake, setSnake] = useState<string[]>(() => [keyOf(7, 7)]);
  const [food, setFood] = useState<string>(() => keyOf(3, 7));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const snakeRef = useRef<string[]>(snake);
  const foodRef = useRef<string>(food);
  const dirRef = useRef<Direction>('right');
  const runningRef = useRef(false);
  const overRef = useRef(false);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    setBest(Number(localStorage.getItem('snake-best') ?? '0'));
  }, []);

  const spawnFood = useCallback((): string => {
    const occupied = new Set(snakeRef.current);
    let k: string;
    do {
      k = keyOf(Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE));
    } while (occupied.has(k));
    return k;
  }, []);

  const changeDir = useCallback((d: Direction) => {
    if (!runningRef.current || d === OPPOSITE[dirRef.current]) return;
    dirRef.current = d;
  }, []);

  const start = useCallback(() => {
    overRef.current = false;
    runningRef.current = true;
    snakeRef.current = [keyOf(7, 7)];
    dirRef.current = 'right';
    const f = spawnFood();
    foodRef.current = f;
    setSnake(snakeRef.current);
    setFood(f);
    setScore(0);
    setIsOver(false);
    setIsRunning(true);
  }, [spawnFood]);

  const endGame = useCallback(() => {
    runningRef.current = false;
    overRef.current = true;
    setIsRunning(false);
    setIsOver(true);
    if (snakeRef.current.length - 1 > best) {
      const b = snakeRef.current.length - 1;
      setBest(b);
      localStorage.setItem('snake-best', String(b));
    }
  }, [best]);

  const step = useCallback(() => {
    const body = snakeRef.current;
    const [dx, dy] = DELTAS[dirRef.current];
    const [hx, hy] = body[0].split(',').map(Number);
    const nx = hx + dx;
    const ny = hy + dy;
    if (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE) {
      endGame();
      return;
    }
    const nKey = keyOf(nx, ny);
    if (body.includes(nKey)) {
      endGame();
      return;
    }
    body.unshift(nKey);
    if (nKey !== foodRef.current) {
      body.pop();
    } else {
      foodRef.current = spawnFood();
      setFood(foodRef.current);
    }
    snakeRef.current = body;
    setSnake([...body]);
    setScore(body.length - 1);
  }, [endGame, spawnFood]);

  useEffect(() => {
    if (!isRunning) return;
    const speed = Math.max(MIN_SPEED, INIT_SPEED - (snake.length - 1) * 8);
    const timer = setInterval(step, speed);
    return () => clearInterval(timer);
  }, [isRunning, snake.length, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ARROW_MAP[e.key]) {
        e.preventDefault();
        changeDir(ARROW_MAP[e.key]);
      } else if (e.key === ' ' && (runningRef.current || overRef.current)) {
        e.preventDefault();
        if (overRef.current) start();
        else if (runningRef.current) runningRef.current = false;
        else runningRef.current = true;
        setIsRunning(runningRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeDir, start]);

  const cells: string[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) cells.push(keyOf(x, y));
  }
  const snakeSet = new Set(snake);
  const headKey = snake[0];

  return (
    <div>
      <Header title="贪吃蛇小游戏" />

      <div className="mx-4 mt-3">
        <div className="rounded-lg bg-card shadow-card px-5 py-4 flex items-center justify-between">
          <div className="text-center">
            <div className="text-xs text-ink-tertiary">当前分数</div>
            <div className="text-2xl font-bold text-primary mt-1">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-ink-tertiary">最高纪录</div>
            <div className="text-2xl font-bold text-income mt-1">{best}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-ink-tertiary">蛇长</div>
            <div className="text-2xl font-bold text-ink mt-1">{snake.length}</div>
          </div>
        </div>

        <div
          className="relative mt-3 rounded-lg overflow-hidden aspect-square bg-ink-primary/95 mx-auto border-2 border-white/50 shadow-card"
          style={{ width: 'min(100%, calc(100vh - 29rem))' }}
        >
          <div
            className="w-full h-full grid"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {cells.map((k) => {
              const [x, y] = k.split(',').map(Number);
              return k === food ? (
                <div key={k} className="bg-income rounded-full m-1 shadow-card" />
              ) : snakeSet.has(k) ? (
                <div
                  key={k}
                  className={`m-0.5 rounded-[2px] ${
                    k === headKey ? 'bg-primary shadow-card' : 'bg-primary-dark'
                  }`}
                />
              ) : (
                <div
                  key={k}
                  className={x > 0 && y > 0 && x < GRID_SIZE - 1 && y < GRID_SIZE - 1
                    ? (x + y) % 2 === 0
                      ? 'bg-white/[0.04] border-[0.5px] border-white/10'
                      : 'border-[0.5px] border-white/10'
                    : 'bg-ink-primary border-[0.5px] border-white/20'}
                />
              );
            })}
          </div>

          {isOver && (
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-pop">
              <div className="text-4xl">🐍</div>
              <div className="text-white text-lg font-bold">游戏结束</div>
              <div className="text-white/80 text-sm">
                本局得分 {snake.length - 1} · 最高 {best}
              </div>
              <button
                className="mt-2 px-8 h-11 rounded-full bg-primary text-white text-sm font-medium btn-press active:bg-primary-dark"
                onClick={start}
              >
                重新开始
              </button>
            </div>
          )}

          {!isOver && !isRunning && (
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-pop">
              <div className="text-4xl">🐍</div>
              <div className="text-white text-base font-semibold">准备好了吗？</div>
              <button
                className="mt-2 px-8 h-11 rounded-full bg-primary text-white text-sm font-medium btn-press active:bg-primary-dark"
                onClick={start}
              >
                开始游戏
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center select-none">
          <button
            className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center text-xl text-ink btn-press active:bg-page"
            onPointerDown={(e) => {
              e.preventDefault();
              changeDir('up');
            }}
            aria-label="向上"
          >
            ▲
          </button>
          <div className="flex gap-16 mt-2">
            <button
              className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center text-xl text-ink btn-press active:bg-page"
              onPointerDown={(e) => {
                e.preventDefault();
                changeDir('left');
              }}
              aria-label="向左"
            >
              ◀
            </button>
            <button
              className="w-14 h-14 rounded-full bg-card shadow-card flex items-center justify-center text-xl text-ink btn-press active:bg-page"
              onPointerDown={(e) => {
                e.preventDefault();
                changeDir('right');
              }}
              aria-label="向右"
            >
              ▶
            </button>
          </div>
          <button
            className="w-14 h-14 mt-2 rounded-full bg-card shadow-card flex items-center justify-center text-xl text-ink btn-press active:bg-page"
            onPointerDown={(e) => {
              e.preventDefault();
              changeDir('down');
            }}
            aria-label="向下"
          >
            ▼
          </button>
        </div>

        <p className="text-center text-xs text-ink-tertiary mt-4 pb-6">
          点击方向按钮或使用键盘方向键控制，空格开始 / 结束
        </p>
      </div>
    </div>
  );
}