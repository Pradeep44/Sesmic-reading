# Take away Assignment

Geologists want to measure earthquake activity for potential earthquakes. They have installed a sensor to track seismic activity. The sensor produces the output and sends it to us in a plain text file. The problem is the different dates and the values are all in different order.

Our system reads this file, saves the data in persistent storage such as a database and provides a web interface to see the summary of the data. (max reading, min reading and number of readings for a particular data or month)

Sample data :

```
20230110 500 200 100 20230219 0.4 80 20230111 0.9 0.1 20230305 12.5 30 75
20230719 0.3 60 120 20230810 800 250 180 -999 20230927 2.5 40 50 20231312 900 200
20230720 0.5 0 20 20230010 800 250 180 300 20231201 2.5 40 50 20231212 900 200
```

The 8-digit numbers are dates(in year-month-day) format. For example the first number 20230110 is January 10, 2023.

Numbers in (0, 1000) range are vibration frequencies (in Hz). The readings for January 10, 2023 are 500, 200 and 100.

Assume every date has at least one good reading, if the date is itself valid.

Explanation

```
20230110 500 200 100 20230219 0.4 80 20230111 0.9 0.1 20230305 12.5 30 75
```

For example, the first one 20230110 corresponds to Jan 10, 2023 (Format is **yyyymmdd**). After that, the next digits before another date are frequencies of earthquakes.

Please mind the edge cases, some dates might be invalid such as 20231403 100 100. Here the month is invalid, In such cases ignore the date and readings and move to the next date.

Another case is when you encounter -999 , in such cases do not read this as a frequency. It represents the machine readings that were corrupted for that line from that point. So, ignore this reading as well as all the reading after this number was found for this line.
Example:

```
20230719 0.3 60 120 20230810 800 250 180 -999 20230927 2.5 40 50 20231312 900 200
20230720 0.5 0 20 20230010 800 250 180 300 20231201 2.5 40 50 20231212 900 200
```

So, here the first line contains -999 for 20230810. So, add 800 250 and 180 as readings for 20230810. Then, stop the reading for this line and move to the next line which is start of 20230720.

Your tasks are the following. Please make sure all are fulfilled:

- Make a data model in the Postgres.
- You can use Prisma or any ORM as well.
- Make a UI for showing the maximum, minimum and number of frequencies of earthquakes on a particular date as well as a particular month.
- A solution markdown file to let us know how things work, your justification for any libraries used and your approach to the solution.
- A good README.md , explaining how we can run your application locally.

The application needs to work in the following way:

- Create an endpoint, say, `/load-data` , that reads the data from the input file and saves it in the database.
- Create endpoint similar to the following:
- An endpoint to check the max/min/count frequency for a particular month. Example: October 2023, Minimum or October 2023, Maximum
- An endpoint to check the max/min/count frequency for a particular day. Example: October 1 2023, Minimum or October 1 2023, Maximum

You are free to use any library or framework, but be ready to justify why you needed to use them.

#### BONUS:

Test cases are always a plus point.
The UI should be neat and UX friendly.
Proper folder structure is always nice to have.
