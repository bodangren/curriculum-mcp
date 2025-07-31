import * as fs from 'fs';
import * as path from 'path';
import { Database } from './types.js';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export class DatabaseManager {
  private static instance: DatabaseManager;
  public db: Database;

  private constructor() {
    this.db = this.loadDatabase();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private loadDatabase(): Database {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Load existing database or create new one
      if (fs.existsSync(DB_PATH)) {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const parsedDb = JSON.parse(data);
        
        // Ensure all required collections exist
        const initialDb: Database = {
          components: [],
          apis: [],
          environment: [],
          'style-guide': [],
          state: [],
          hooks: [],
          conventions: [],
          units: [],
          lessons: [],
          lessonPhases: [],
          appConnections: [],
          assessments: [],
          tasks: []
        };
        
        // Merge with existing data, ensuring all arrays exist
        return {
          ...initialDb,
          ...parsedDb,
          // Ensure arrays are actually arrays
          components: Array.isArray(parsedDb.components) ? parsedDb.components : [],
          apis: Array.isArray(parsedDb.apis) ? parsedDb.apis : [],
          environment: Array.isArray(parsedDb.environment) ? parsedDb.environment : [],
          'style-guide': Array.isArray(parsedDb['style-guide']) ? parsedDb['style-guide'] : [],
          state: Array.isArray(parsedDb.state) ? parsedDb.state : [],
          hooks: Array.isArray(parsedDb.hooks) ? parsedDb.hooks : [],
          conventions: Array.isArray(parsedDb.conventions) ? parsedDb.conventions : [],
          units: Array.isArray(parsedDb.units) ? parsedDb.units : [],
          lessons: Array.isArray(parsedDb.lessons) ? parsedDb.lessons : [],
          lessonPhases: Array.isArray(parsedDb.lessonPhases) ? parsedDb.lessonPhases : [],
          appConnections: Array.isArray(parsedDb.appConnections) ? parsedDb.appConnections : [],
          assessments: Array.isArray(parsedDb.assessments) ? parsedDb.assessments : [],
          tasks: Array.isArray(parsedDb.tasks) ? parsedDb.tasks : []
        };
      } else {
        // Initialize empty database
        const initialDb: Database = {
          components: [],
          apis: [],
          environment: [],
          'style-guide': [],
          state: [],
          hooks: [],
          conventions: [],
          units: [],
          lessons: [],
          lessonPhases: [],
          appConnections: [],
          assessments: [],
          tasks: []
        };
        this.saveDatabase(initialDb);
        return initialDb;
      }
    } catch (error) {
      throw new Error(`Failed to load database: ${error}`);
    }
  }

  private saveDatabase(db: Database): void {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (error) {
      throw new Error(`Failed to save database: ${error}`);
    }
  }

  getDatabase(): Database {
    return this.db;
  }

  updateDatabase(updates: Partial<Database>): void {
    this.db = { ...this.db, ...updates };
    this.saveDatabase(this.db);
  }

  // Generic CRUD operations
  getCollection<T>(collectionName: keyof Database): T[] {
    return this.db[collectionName] as unknown as T[];
  }

  addToCollection<T extends { id: string }>(collectionName: keyof Database, item: T): T {
    const collection = this.db[collectionName] as unknown as T[];
    
    // Ensure collection exists and is an array
    if (!collection || !Array.isArray(collection)) {
      throw new Error(`Collection ${collectionName} is not properly initialized`);
    }
    
    // Check if item with same ID already exists
    if (collection.some(existing => existing.id === item.id)) {
      throw new Error(`Item with ID ${item.id} already exists in ${collectionName}`);
    }
    
    collection.push(item);
    this.saveDatabase(this.db);
    return item;
  }

  updateInCollection<T extends { id: string }>(
    collectionName: keyof Database, 
    id: string, 
    updates: Partial<T>
  ): T | null {
    const collection = this.db[collectionName] as unknown as T[];
    const index = collection.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    collection[index] = { ...collection[index], ...updates };
    this.saveDatabase(this.db);
    return collection[index];
  }

  deleteFromCollection(collectionName: keyof Database, id: string): boolean {
    const collection = this.db[collectionName] as { id: string }[];
    const index = collection.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    collection.splice(index, 1);
    this.saveDatabase(this.db);
    return true;
  }

  findById<T extends { id: string }>(collectionName: keyof Database, id: string): T | null {
    const collection = this.db[collectionName] as unknown as T[];
    return collection.find(item => item.id === id) || null;
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}