import { Injectable } from '@angular/core';
import { MatamReading } from '../data/matam-data';
import { FilterState } from '../components/filters.component';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private timeCategories = new Map<string, string>();

  filterData(data: MatamReading[], filters: FilterState): MatamReading[] {
    return data.filter(item => {
      const cityMatch = !filters.city || item.city === filters.city;
      const readerMatch = !filters.reader || item.reader.toLowerCase().includes(filters.reader.toLowerCase());
      const matamMatch = !filters.matam || item.matam.toLowerCase().includes(filters.matam.toLowerCase());
      const timeMatch = !filters.time || this.getTimeCategory(item.time) === filters.time;
      const currentTimeMatch = !filters.currentTime || filters.currentTime !== 'upcoming' || this.isUpcoming(item.time);

      return cityMatch && readerMatch && matamMatch && timeMatch && currentTimeMatch;
    });
  }

  sortData(data: MatamReading[], sortType: string): MatamReading[] {
    if (!sortType) return data;

    return [...data].sort((a, b) => {
      const timeA = this.parseTimeString(a.time);
      const timeB = this.parseTimeString(b.time);

      if (!timeA && !timeB) return 0;
      if (!timeA) return 1;
      if (!timeB) return -1;

      const minutesA = timeA.hours * 60 + timeA.minutes;
      const minutesB = timeB.hours * 60 + timeB.minutes;

      if (sortType === 'time-asc') {
        return minutesA - minutesB;
      } else if (sortType === 'time-desc') {
        return minutesB - minutesA;
      }

      return 0;
    });
  }

  private getTimeCategory(timeString: string): string {
    if (!timeString) return '';

    if (this.timeCategories.has(timeString)) {
      return this.timeCategories.get(timeString)!;
    }

    let category = '';
    if (timeString.includes('صباحًا') || timeString.includes('صباحاً')) {
      category = 'صباحا';
    } else if (timeString.includes('ظهراً') || timeString.includes('الظهرين')) {
      category = 'ظهرا';
    } else if (timeString.includes('عصراً') || timeString.includes('عصرًا')) {
      category = 'عصرا';
    } else if (timeString.includes('مساءً') || timeString.includes('مساءا') || timeString.includes('العشاءين')) {
      category = 'مساءا';
    }

    this.timeCategories.set(timeString, category);
    return category;
  }

  private parseTimeString(timeString: string): { hours: number; minutes: number } | null {
    if (!timeString) return null;

    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(صباحًا|صباحاً|ظهراً|عصراً|عصرًا|مساءً|مساءا)/);
    if (!timeMatch) return null;

    let [, hours, minutes, period] = timeMatch;
    let parsedHours = parseInt(hours);
    const parsedMinutes = parseInt(minutes);

    if (period.includes('صباح')) {
      if (parsedHours === 12) parsedHours = 0;
    } else if (period.includes('ظهراً')) {
      if (parsedHours !== 12) parsedHours += 12;
    } else if (period.includes('عصر')) {
      parsedHours += 12;
    } else if (period.includes('مساء')) {
      if (parsedHours !== 12) parsedHours += 12;
    }

    return { hours: parsedHours, minutes: parsedMinutes };
  }

  private isUpcoming(timeString: string): boolean {
    const parsedTime = this.parseTimeString(timeString);
    if (!parsedTime) return false;

    const now = new Date();
    const eventTime = new Date();
    eventTime.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

    return eventTime > now;
  }
}