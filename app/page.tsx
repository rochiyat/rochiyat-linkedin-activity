'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';

const Home: React.FC = () => {
  interface DataItem {
    Date: string;
  }
  const defaultGrid: (Date | null)[][] = Array(7).fill(Array(52).fill(null));

  const [grid, setGrid] = useState<(Date | null)[][]>(defaultGrid);
  const [startDate, setStartDate] = useState<Date | null>(null);

  function getMonthName(month: number) {
    if (month > 11) {
      month = month % 12;
    }
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return monthNames[month];
  }

  function getDayName(day: number) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[day];
  }

  function generateDateGrid(dataDates: string[]) {
    const grid = [];

    for (let i = 0; i < 7; i++) {
      const days = [];
      const currentDate = moment(dataDates[0], 'DD/MM/YYYY');
      currentDate.add(i, 'day');

      for (let j = 0; j < 52; j++) {
        if (dataDates.includes(moment(currentDate).format('DD/MM/YYYY'))) {
          days.push(moment(currentDate).toDate());
        } else {
          days.push(null);
        }
        currentDate.add(7, 'day'); // Move to next week
      }
      grid.push(days);
    }
    return grid;
  }

  useEffect(() => {
    fetch(
      'https://opensheet.elk.sh/12J0NsUJfMU0I2qmPibz7aFXrJMk9SsnH1UUWyYeSQ3E/1'
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        const dataDates = data.map((item: DataItem) => {
          return item.Date;
        });

        const newGrid = generateDateGrid(dataDates);
        setGrid(newGrid);
        setStartDate(newGrid[0][0]);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Title */}
      <h1 className="text-xl font-bold mb-6">LinkedIn Activity Grid</h1>
      <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
        <table className="table-auto">
          <thead>
            <tr className="pb-2">
              <td></td>
              {Array.from({ length: 12 }).map((_, idx) => (
                <td
                  key={idx}
                  className="text-xs text-white h-[20px]"
                  colSpan={idx < 8 && idx % 2 === 0 ? 5 : 4}
                >
                  {getMonthName((startDate ?? new Date()).getMonth() + idx)}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((days, idx) => (
              <tr key={idx}>
                <td>
                  {(idx === 0 || idx === 2 || idx === 4) && (
                    <div className="pr-2 h-[10px]">
                      <span className="text-xs text-white relative">
                        {getDayName(idx + 1)}
                      </span>
                    </div>
                  )}
                </td>
                {days.map((week, weekIdx) => (
                  <td key={weekIdx}>
                    <div className="relative">
                      <div
                        className={`w-2.5 h-2.5 rounded-sm ${
                          week !== null ? 'bg-green-500' : 'bg-slate-500'
                        }`}
                      ></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <footer className="mt-6 text-sm text-gray-400">
        Built by{' '}
        <a
          href="https://www.linkedin.com/in/rochiyat-rochiyat-70b67021/"
          className="text-blue-400 underline"
        >
          rochiyat
        </a>
        . Source code available on{' '}
        <a
          href="https://github.com/rochiyat/rochiyat-linkedin-activity.git"
          className="text-blue-400 underline"
        >
          GitHub
        </a>
        . Check data source on{' '}
        <a
          href="https://docs.google.com/spreadsheets/d/12J0NsUJfMU0I2qmPibz7aFXrJMk9SsnH1UUWyYeSQ3E/edit?gid=0#gid=0"
          className="text-blue-400 underline"
        >
          Google Sheet
        </a>
      </footer>
    </div>
  );
};

export default Home;
