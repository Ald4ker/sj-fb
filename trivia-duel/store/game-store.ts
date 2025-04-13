import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, Team, Question } from '@/types';
import { getRandomQuestion } from '@/mocks/questions';

interface GameStore extends GameState {
  // Team management
  setTeams: (teams: Team[]) => void;
  updateTeamScore: (teamId: string, points: number) => void;
  adjustTeamScore: (teamId: string, adjustment: number) => void;
  updateTeams: (updates: {teamId: string, points: number}[]) => void;
  // Category management
  toggleCategory: (categoryId: string) => void;
  setSelectedCategories: (categoryIds: string[]) => void;
  
  // Question management
  setCurrentQuestion: (question: Question | null) => void;
  markQuestionAnswered: (questionId: string) => void;
  getRandomUnansweredQuestion: () => Question | null;
  addQuestions: (questions: Question[]) => Promise<boolean>;
  // Wager management
  setWagerTeam: (teamId: string | null) => void;
  setWagerTargetTeam: (teamId: string | null) => void;
  setWagerMultiplier: (multiplier: 0.5 | 1.5 | 2 | null) => void;
  setWagerActive: (active: boolean) => void;
  useWager: (teamId: string) => void;

  // Game state
  resetGame: () => void;
  startNewGame: () => void;
  completeGame: () => void;
  init: () => Promise<boolean>;
  cleanup: () => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  // Loading states
  setQuestionLoading: (isLoading: boolean) => void;
  setCouponLoading: (isLoading: boolean) => void;
}

const initialState: GameState = {
  teams: [],
  selectedCategories: [],
  answeredQuestions: [],
  currentQuestion: null,
  wagerAvailable: {
    team1: true,
    team2: true
  },
  wagerActive: false,
  wagerTeam: null,
  wagerTargetTeam: null,
wagerMultiplier: null,
  gameCompleted: false
};

interface ExtendedGameState extends GameState {
  loading: { questions: boolean; coupons: boolean };
}

const db = SQLite.openDatabase('trivia.db');

const createQuestionsTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY, category_id TEXT, text TEXT, answer TEXT, difficulty TEXT, points INTEGER)',
      [],
      () => console.log('Questions table created successfully'),
      (_, error) => console.error('Error creating questions table:', error)
    );
  });
};

const createCouponsTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS coupons (ccode TEXT PRIMARY KEY, value INTEGER)',
      [],
      () => console.log('Coupons table created successfully'),
      (_, error) => console.error('Error creating coupons table:', error)
    );
  });
};

const populateCouponsTable = (csvData: string) => {
  const lines = csvData.trim().split('\n');
  const data = lines.slice(1).map(line => {
    const [ccode, value] = line.split(',');
    return { ccode, value: parseInt(value, 10) };
  });

 db.transaction(tx => {
    data.forEach(({ ccode, value }) => {
      tx.executeSql(
        'INSERT OR IGNORE INTO coupons (ccode, value) VALUES (?, ?)',
        [ccode, value],
        () => console.log(`Coupon ${ccode} inserted successfully`),
        (_, error) => console.error(`Error inserting coupon ${ccode}:`, error)
      );
    });
  });
};
const initialState: ExtendedGameState = { ...initialState as GameState, loading: { questions: false, coupons: false } };
export const useGameStore = create<GameStore>()(
 persist(
    (set, get) => ({
      ...initialState,

      // Team management
      setTeams: (teams: Team[]) => set({ teams }),
      
      updateTeamScore: (teamId: string, points: number) => set(state => ({
        teams: state.teams.map(team => 
          team.id === teamId 
            ? { ...team, score: team.score + points } 
            : team
        )
      })),
      
      adjustTeamScore: (teamId: string, adjustment: number) => set(state => ({
        teams: state.teams.map(team => 
          team.id === teamId 
            ? { ...team, score: team.score + adjustment } 
            : team
        )
      })),
      updateTeams: (updates: {teamId: string, points: number}[]) => set(state => {
        const teamMap = new Map(state.teams.map(team => [team.id, team]));
        
        updates.forEach(({teamId, points}) => {
          const team = teamMap.get(teamId);
          if (team) {
            teamMap.set(teamId, {...team, score: team.score + points});
          }
        });
        
        return {
          teams: Array.from(teamMap.values())
        };
      }),
      
      
      // Category management
      toggleCategory: (categoryId: string) => set(state => {
        const isSelected = state.selectedCategories.includes(categoryId);
        
        if (isSelected) {
          return {
            selectedCategories: state.selectedCategories.filter(id => id !== categoryId)
          };
        } else {
          // Only allow adding if we don't already have 6 categories
          if (state.selectedCategories.length < 6) {
            return {
              selectedCategories: [...state.selectedCategories, categoryId]
            };
          }
        }
        
        return state;
      }),
      
      
      setSelectedCategories: (categoryIds: string[]) => set({ 
        selectedCategories: categoryIds 
      }),
      
      // Question management
      setCurrentQuestion: (question: Question | null) => set({ 
        currentQuestion: question 
      }),
      
      markQuestionAnswered: (questionId: string) => set(state => ({
        answeredQuestions: [...state.answeredQuestions, questionId],
        currentQuestion: null
      })),
      
      getRandomUnansweredQuestion: () => {
        const { selectedCategories, answeredQuestions } = get();
        return getRandomQuestion(selectedCategories, answeredQuestions);
      },
      addQuestions: async (questions: Question[]) => {
        get().setQuestionLoading(true);
        
        try {
          await new Promise<void>((resolve, reject) => {
            db.transaction(tx => {
              questions.forEach(q => {
                tx.executeSql(
                  'INSERT OR REPLACE INTO questions (id, category_id, text, answer, difficulty, points) VALUES (?, ?, ?, ?, ?, ?)',
                  [q.id, q.categoryId, q.text, q.answer, q.difficulty, q.points],
                  undefined,
                  (_, error) => {
                    console.error('Error inserting question:', error);
                    reject(error);
                    return false; // Stop transaction on error
                  }
                );
              });
            }, reject, resolve);
          });
          
          console.log(`${questions.length} questions added successfully`);
          return true;
        } catch (error) {
          console.error('Failed to add questions:', error);
          return false;
        } finally {
          get().setQuestionLoading(false);
        }
      },

      // Loading state management
      setQuestionLoading: (isLoading: boolean) => set(state => ({
        loading: {
          ...state.loading,
          questions: isLoading
        }
      })),
setCouponLoading: (isLoading: boolean) => set(state => ({
        loading: {
          ...state.loading,
          coupons: isLoading
        }
      })),
      
      // Wager management
      setWagerTeam: (teamId: string | null) => set({ wagerTeam: teamId }),
      
      setWagerTargetTeam: (teamId: string | null) => set({ wagerTargetTeam: teamId }),
      
      setWagerMultiplier: (multiplier: 0.5 | 1.5 | 2 | null) => set({ 
        wagerMultiplier: multiplier 
      }),

      setWagerActive: (active: boolean) => set({ wagerActive: active }),

      useWager: (teamId: string) => set(state => {
        const teamIndex = state.teams.findIndex(t => t.id === teamId);
        if (teamIndex === -1) return state; // Guard clause
        
        const wagerAvailable = {...state.wagerAvailable};
        const key = teamIndex === 0 ? 'team1' : 'team2';
        wagerAvailable[key] = false;
        
        return {
          wagerAvailable,
          wagerTeam: teamId,
          wagerActive: true
        };
      }),

      applyCoupon: async (couponCode: string) => {
        get().setCouponLoading(true);
        
        try {
          return await new Promise<boolean>((resolve) => {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT value FROM coupons WHERE ccode = ?',
                [couponCode],
                (_, { rows }) => {
                  if (rows.length > 0) {
                    const coupon = rows.item(0);
                    const value = coupon.value;
                    // Apply to first team
                    const teamId = get().teams[0]?.id;
                    if (teamId) {
                      get().updateTeamScore(teamId, value);
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  } else {
                    resolve(false);
                  }
                },
                (_, error) => {
                  console.error('Error checking coupon:', error);
                  resolve(false);
                  return false;
                }
              );
            });
          });
        } finally {
          get().setCouponLoading(false);
        }
      },
      
      // Game state
      resetGame: () => set(initialState),
      
      startNewGame: () => set(state => ({
        ...initialState,
        teams: state.teams.map(team => ({ ...team, score: 0 })),
        loading: state.loading // Preserve loading state
      })),
      
      completeGame: () => set({ gameCompleted: true }),

      init: async () => {
        try {
          await createQuestionsTable();
          await createCouponsTable();
          
          // Check if coupons already exist before populating
          const couponCount = await countCoupons();
          
          // Only populate if no coupons exist
          if (couponCount === 0) {
            await populateCouponsTable('ccode,value\nTEST1234,100');
          }
          
          console.log('Game initialization complete');
          return true;
        } catch (error) {
          console.error('Game initialization failed:', error);
          return false;
        }
      },
      
      cleanup: async () => {
        return new Promise<void>((resolve) => {
          db.closeAsync()
            .then(() => {
              console.log('Database closed successfully');
              resolve();
            })
            .catch(error => {
              console.error('Error closing database:', error);
              resolve();
            });
        });
      }
    }),
    {
      name: 'trivia-game',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

// Initialize the store
useGameStore.getState().init().then(success => {
  if (success) {
    console.log('Game store initialized successfully');
  } else {
    console.error('Failed to initialize game store');
  }
});

useGameStore.getState().init();
         