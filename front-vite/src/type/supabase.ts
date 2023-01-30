export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity: {
        Row: {
          id: string
          name: string | null
          displayName: string | null
          parentActivityId: string | null
          color: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          displayName?: string | null
          parentActivityId?: string | null
          color?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          displayName?: string | null
          parentActivityId?: string | null
          color?: string | null
        }
      }
      relStreetToponym: {
        Row: {
          streetId: string
          toponymId: string
          level: number | null
        }
        Insert: {
          streetId: string
          toponymId: string
          level?: number | null
        }
        Update: {
          streetId?: string
          toponymId?: string
          level?: number | null
        }
      }
      street: {
        Row: {
          id: string
          name: string | null
          length: Json | null
          width: Json | null
          coords: Json | null
          parisDataInfo: Json | null
          nameOrigin: Json | null
          history: Json | null
          namingDate: Json | null
          creationDate: Json | null
          lastUpdate: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          length?: Json | null
          width?: Json | null
          coords?: Json | null
          parisDataInfo?: Json | null
          nameOrigin?: Json | null
          history?: Json | null
          namingDate?: Json | null
          creationDate?: Json | null
          lastUpdate?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          length?: Json | null
          width?: Json | null
          coords?: Json | null
          parisDataInfo?: Json | null
          nameOrigin?: Json | null
          history?: Json | null
          namingDate?: Json | null
          creationDate?: Json | null
          lastUpdate?: string | null
        }
      }
      toponym: {
        Row: {
          id: string
          type: string
          lastUpdate: string | null
          name: string | null
          wikipedia: Json | null
        }
        Insert: {
          id?: string
          type: string
          lastUpdate?: string | null
          name?: string | null
          wikipedia?: Json | null
        }
        Update: {
          id?: string
          type?: string
          lastUpdate?: string | null
          name?: string | null
          wikipedia?: Json | null
        }
      }
      toponymBattle: {
        Row: {
          id: string
          startDate: Json | null
          endDate: Json | null
        }
        Insert: {
          id: string
          startDate?: Json | null
          endDate?: Json | null
        }
        Update: {
          id?: string
          startDate?: Json | null
          endDate?: Json | null
        }
      }
      toponymBuilding: {
        Row: {
          id: string
          endBuildingDate: Json | null
        }
        Insert: {
          id: string
          endBuildingDate?: Json | null
        }
        Update: {
          id?: string
          endBuildingDate?: Json | null
        }
      }
      toponymPerson: {
        Row: {
          id: string
          nationality: Json | null
          birthday: Json | null
          deathday: Json | null
          lifeCentury: Json | null
          gender: Json | null
          politicScale: Json | null
          activities: Json | null
        }
        Insert: {
          id: string
          nationality?: Json | null
          birthday?: Json | null
          deathday?: Json | null
          lifeCentury?: Json | null
          gender?: Json | null
          politicScale?: Json | null
          activities?: Json | null
        }
        Update: {
          id?: string
          nationality?: Json | null
          birthday?: Json | null
          deathday?: Json | null
          lifeCentury?: Json | null
          gender?: Json | null
          politicScale?: Json | null
          activities?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
