//+------------------------------------------------------------------+
//|                                                      ProjectName |
//|                                      Copyright 2018, CompanyName |
//|                                       http://www.companyname.net |
//+------------------------------------------------------------------+
#property copyright "Forex Forest 2021"
#property link "http://www.forexforest.net/"
#property description "For Forex-Forest Internal use only."
#property version "0.1 (ver 20211123)"
#property strict

#property indicator_separate_window
#property indicator_buffers 3
#property indicator_color1 clrDodgerBlue
#property indicator_color2 clrRed
#property indicator_color3 clrSilver
#property indicator_type1 DRAW_LINE
#property indicator_type2 DRAW_LINE
#property indicator_type3 DRAW_HISTOGRAM
//#property indicator_width3 2

#include "../../../Experts/src/_header/ffGEMS3.mqh"
#include "../../../Experts/src/_header/ffVarMarket.mqh"
#include "../../../Experts/src/_header/InternetLib.mqh"
#include "../../../Experts/src/_header/ffUtilPanel.mqh"

// #include "../../MQL4/Experts/src/_header/ffGEMS3.mqh"
// #include "../../MQL4/Experts/src/_header/ffVarMarket.mqh"
// #include "../../MQL4/Experts/src/_header/InternetLib.mqh"
// #include "../../MQL4/Experts/src/_header/ffUtilPanel.mqh"
// #include <stdlib.mqh>

// extern --->

enum http_enum
{
    HTTP = 80,
    HTTPS = 443,
};

http_enum http_protocol = HTTPS;                       // HTML Protocol
string source = "macd-opt.s3.us-east-2.amazonaws.com"; // Source Folder
string filename = "trade_data.csv";                    //"macd_opt_1.csv"; //Source File

// extern --->

enum opt_enum
{
    greatest_netProfitMode,     // (+) Net Profit
    greatest_profitMode,        // (+) Profit
    greatest_lossMode,          // (+) Loss
    greatest_winRateMode,       // (+) Win rate
    greatest_lossRateMode,      // (+) Loss rate
    greatest_sharpeRatioMode,   // (+) Sharpe Ratio
    greatest_stdDevMode,        // (+) Standard deviation
    greatest_minHoldTimeMode,   // (+) Minimum holding time
    greatest_avgHoldTimeMode,   // (+) Average holding time
    greatest_maxHoldTimeMode,   // (+) Maximum holding time
    greatest_profitPerTimeMode, // (+) Profit per time
    smallest_netProfitMode,     // (-) Net Profit
    smallest_profitMode,        // (-) Profit
    smallest_lossMode,          // (-) Loss
    smallest_winRateMode,       // (-) Win rate
    smallest_lossRateMode,      // (-) Loss rate
    smallest_sharpeRatioMode,   // (-) Sharpe Ratio
    smallest_stdDevMode,        // (-) Standard deviation
    smallest_minHoldTimeMode,   // (-) Minimum holding time
    smallest_avgHoldTimeMode,   // (-) Average holding time
    smallest_maxHoldTimeMode,   // (-) Maximum holding time
    smallest_profitPerTimeMode, // (-) Profit per time
};

extern opt_enum opt_mode = greatest_netProfitMode; // Display mode

enum parameterOptimization
{
    yesX, // Yes
    noX,  // No
};

extern parameterOptimization mode = 0; // Parameter optimization

double main_buffer[], signal_buffer[], diff_buffer[];

string shortName = "FF Create Graph";

ffWeb net;
string fullPath;

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+

enum trainingDirection
{
    forward,  // Forward
    backward, // Backward
};

extern trainingDirection direction = 0; // Training direction

enum playback
{
    yesY = 100, // Yes
    noY = 0,    // No
};

extern playback speed = 0; // Playback

input datetime trainFrom = (datetime) "2007.01.01"; // Training from
input datetime trainTo = (datetime) "2007.12.30";   // Training to

input int slotsToTrade = 50;        // Slots to trade
input int smallestMACD = 5;        // Fast MACD
input int biggestMACD = 10;        // Slow MACD
input int barsForNextTraining = 7; // Bars waited before next training

datetime
    time_from,
    time_to;

int
    handle,
    count = 0,
    counter,
    fast,
    slow,
    signal,
    statSize = 22,
    optimizedProfitMode,
    bigValue = 100000000000,
    scanRange;

string statString[], statSentence[];

double
    statData[],
    optimization[22][5];

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+

class macd_data
{
public:
    int fast, slow, signal;
    void operator=(string s)
    {
        string inner = StringSubstr(s, 1, StringLen(s) - 2); // REMOVE HEAD & TAIL
        string param[];
        StringSplit(inner, ';', param);
        fast = StringToInteger(param[0]);
        slow = StringToInteger(param[1]);
        signal = StringToInteger(param[2]);
    }
    string String(void) const
    {
        return "(" + fast + ", " + slow + ", " + signal + ")";
    }
};

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
class macd_opt_data
{
public:
    datetime dt;
    macd_data overfittedData[22];
    string String(void) const
    {
        return dt + "/" +
               overfittedData[0].String() + "/" +
               overfittedData[1].String() + "/" +
               overfittedData[2].String() + "/" +
               overfittedData[3].String() + "/" +
               overfittedData[4].String() + "/" +
               overfittedData[5].String() + "/" +
               overfittedData[6].String() + "/" +
               overfittedData[7].String() + "/" +
               overfittedData[8].String() + "/" +
               overfittedData[9].String() + "/" +
               overfittedData[10].String() + "/" +
               overfittedData[11].String() + "/" +
               overfittedData[12].String() + "/" +
               overfittedData[13].String() + "/" +
               overfittedData[14].String() + "/" +
               overfittedData[15].String() + "/" +
               overfittedData[16].String() + "/" +
               overfittedData[17].String() + "/" +
               overfittedData[18].String() + "/" +
               overfittedData[19].String() + "/" +
               overfittedData[20].String() + "/" +
               overfittedData[21].String();
    }
};
macd_opt_data data_row[];

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void DownloadCSV()
{
    // CREATE REQUEST
    string cookie = NULL, headers;
    char post[], result[];
    int res;
    string TXT = "";
    string url = fullPath;
    ResetLastError();
    int timeout = 5000;
    res = ffWeb::Request("GET", url, cookie, NULL, timeout, post, 0, result, headers);
    if (res == -1)
    {
        // ERROR
        int errCode = GetLastError();
        Print("WebRequest error, err.code  =" + errCode);
        return;
    }
    // FILE HANDLE
    int filehandle = FileOpen(filename, FILE_WRITE | FILE_BIN);
    if (filehandle == INVALID_HANDLE)
    {
        Print("Error in FileOpen. Error code =" + GetLastError());
        return;
    }
    // WRITE TO DISK
    FileWriteArray(filehandle, result, 0, ArraySize(result));
    FileClose(filehandle);

    Print("MACD Auto-config successfully downloaded, the file size in bytes  =" + ArraySize(result) + ".");
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void createTrades()
{
    if (count < slotsToTrade)
    {
        for (int i = 0; i < statSize; i++)
        {
            if (i < statSize / 2)
            {
                optimization[i][3] = -bigValue;
            }
            else
            {
                optimization[i][3] = bigValue;
            }
        }
        counter = 0;

        if (direction == 0)
        {
            createTraining();
        }

        if (direction == 1)
        {
            createTraining_2(biggestMACD, biggestMACD, biggestMACD, biggestMACD, biggestMACD);
        }

        writeToFile();

        count++;
        createTrades();
    }
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void writeToFile()
{
    /*Alert(
        " [ ",count," / ", slotsToTrade,
        " ] ---> ( ", trainTo + count * barsForNextTraining * scanRange, " ) ---> ( ",highest_profit[0],
        ", ", highest_profit[1],
        ", ", highest_profit[2],
        " ) ---> ( ",consistent_profit[0],
        ", ", consistent_profit[1],
        ", ", consistent_profit[2]," ) ");*/

    FileWrite(handle, TimeToStr(trainTo + count * barsForNextTraining * scanRange, TIME_DATE | TIME_SECONDS),
              "(" + optimization[0][0] + "; " + optimization[0][1] + "; " + optimization[0][2] + ")",
              "(" + optimization[1][0] + "; " + optimization[1][1] + "; " + optimization[1][2] + ")",
              "(" + optimization[2][0] + "; " + optimization[2][1] + "; " + optimization[2][2] + ")",
              "(" + optimization[3][0] + "; " + optimization[3][1] + "; " + optimization[3][2] + ")",
              "(" + optimization[4][0] + "; " + optimization[4][1] + "; " + optimization[4][2] + ")",
              "(" + optimization[5][0] + "; " + optimization[5][1] + "; " + optimization[5][2] + ")",
              "(" + optimization[6][0] + "; " + optimization[6][1] + "; " + optimization[6][2] + ")",
              "(" + optimization[7][0] + "; " + optimization[7][1] + "; " + optimization[7][2] + ")",
              "(" + optimization[8][0] + "; " + optimization[8][1] + "; " + optimization[8][2] + ")",
              "(" + optimization[9][0] + "; " + optimization[9][1] + "; " + optimization[9][2] + ")",
              "(" + optimization[10][0] + "; " + optimization[10][1] + "; " + optimization[10][2] + ")",
              "(" + optimization[11][0] + "; " + optimization[11][1] + "; " + optimization[11][2] + ")",
              "(" + optimization[12][0] + "; " + optimization[12][1] + "; " + optimization[12][2] + ")",
              "(" + optimization[13][0] + "; " + optimization[13][1] + "; " + optimization[13][2] + ")",
              "(" + optimization[14][0] + "; " + optimization[14][1] + "; " + optimization[14][2] + ")",
              "(" + optimization[15][0] + "; " + optimization[15][1] + "; " + optimization[15][2] + ")",
              "(" + optimization[16][0] + "; " + optimization[16][1] + "; " + optimization[16][2] + ")",
              "(" + optimization[17][0] + "; " + optimization[17][1] + "; " + optimization[17][2] + ")",
              "(" + optimization[18][0] + "; " + optimization[18][1] + "; " + optimization[18][2] + ")",
              "(" + optimization[19][0] + "; " + optimization[19][1] + "; " + optimization[19][2] + ")",
              "(" + optimization[20][0] + "; " + optimization[20][1] + "; " + optimization[20][2] + ")",
              "(" + optimization[21][0] + "; " + optimization[21][1] + "; " + optimization[21][2] + ")");
    FileFlush(handle);
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void createTraining() // Forward training
{
    int arrSize = biggestMACD + 1;

    for (int i = smallestMACD; i < arrSize; i++)
    {
        for (int j = smallestMACD; j < arrSize; j++)
        {
            if (i < j && i != j)
            {
                for (int k = smallestMACD; k < arrSize; k++)
                {
                    if (j != k && k != i)
                    {
                        fast = i;
                        slow = j;
                        signal = k;
                        monteCarlo();
                    }
                }
            }
        }
    }
}

void createTraining_2(int x, int y, int z, int tempY, int tempZ) // Backward training
{
    if (x > smallestMACD - 1)
    {
        if (y > smallestMACD - 1)
        {
            if (z > smallestMACD - 1)
            {
                if (x < y && x != y && y != z && z != x)
                {
                    fast = x;
                    slow = y;
                    signal = z;
                    monteCarlo();
                }
                createTraining_2(x, y, z - 1, tempY, tempZ);
            }
            else
            {
                z = tempZ;
                createTraining_2(x, y - 1, z, tempY, tempZ);
            }
        }
        else
        {
            y = tempY;
            createTraining_2(x - 1, y, z, tempY, tempZ);
        }
    }
}

void monteCarlo()
{
    ResetBuffers();
    ArrayResize(data_row, 2);
    time_from = trainFrom + count * barsForNextTraining * scanRange; // Trading from
    time_to = trainTo + count * barsForNextTraining * scanRange;     // Trading to

    data_row[0].dt = time_from;
    data_row[1].dt = time_to;

    for (int i = 0; i < statSize; i++)
    {
        data_row[0].overfittedData[i] = "(" + fast + "; " + slow + "; " + signal + ")";
        data_row[1].overfittedData[i] = data_row[1].overfittedData[i];
    }

    ScanTradableZone();
    CalculateZoneStat();
    CalculateTotalStat();

    Print(" [ Process ] ---> [ ", count, " / ", slotsToTrade, "] ---> [ Training from ] ---> [ " + TimeToStr(time_from) + " ] ---> [ Training to ] ---> [ " + TimeToStr(time_to), " ] ---> [ MACD ]---> ( " + fast + ", " + slow + ", " + signal + " ) ");
    // Display();
    // ObjectsDeleteAll();
    for (int i = 0; i < statSize; i++)
    {
        statDataDefine();
        if (optimization[i][3] < statData[i] && (i < statSize / 2))
        {
            optimization[i][0] = fast;
            optimization[i][1] = slow;
            optimization[i][2] = signal;
            optimization[i][3] = statData[i];
        }
        if (optimization[i][3] > statData[i] && (i >= statSize / 2))
        {
            optimization[i][0] = fast;
            optimization[i][1] = slow;
            optimization[i][2] = signal;
            optimization[i][3] = statData[i - (statSize / 2)];
        }
    }
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void statDataDefine()
{
    ArrayResize(statData, statSize);
    statData[0] = stat.netProfit / M.point;
    statData[1] = stat.profit / M.point;
    statData[2] = stat.loss / M.point;
    statData[3] = stat.winRate * 100;
    statData[4] = stat.lossRate * 100;
    statData[5] = stat.sharpeRatio;
    statData[6] = stat.stdDev / M.point;
    statData[7] = stat.minHoldTime / 3600.0;
    statData[8] = stat.avgHoldTime / 3600.0;
    statData[9] = stat.maxHoldTime / 3600.0;
    statData[10] = stat.profitPerTime / M.point;
    for (int i = statSize / 2, j = 0; i < statSize; i++, j++)
    {
        statData[i] = statData[j];
    }
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void statStringDefine()
{
    ArrayResize(statString, statSize);
    statString[0] = "Net profit";
    statString[1] = "Profit";
    statString[2] = "Loss";
    statString[3] = "Win rate";
    statString[4] = "Loss rate";
    statString[5] = "Sharpe ratio";
    statString[6] = "Standard deviation";
    statString[7] = "Minimum holding time";
    statString[8] = "Average holding time";
    statString[9] = "Maximum holding time";
    statString[10] = "Profit per time";
    for (int i = statSize / 2, j = 0; i < statSize; i++, j++)
    {
        statString[i] = statString[j];
    }
    for (int i = 0; i < statSize; i++)
    {
        if (i < statSize / 2)
        {
            statString[i] = "(+) " + statString[i];
        }
        else
        {
            statString[i] = "(-) " + statString[i];
        }
    }
}

void statSentenceDefine()
{
    ArrayResize(statSentence, statSize/2);
    statSentence[0] = statString[0] + " ---> [ $ " + int(stat.netProfit / M.point) + " ] ";
    statSentence[1] = statString[1] + " ---> [ $ " + int(stat.profit / M.point) + " ] ";
    statSentence[2] = statString[2] + " ---> [ $ " + int(stat.loss / M.point) + " ] ";
    statSentence[3] = statString[3] + " ---> [ " + DoubleToStr(stat.winRate * 100, 2) + " % ] ";
    statSentence[4] = statString[4] + " ---> [ " + DoubleToStr(stat.lossRate * 100, 2) + " % ] ";
    statSentence[5] = statString[5] + " ---> [ " + DoubleToStr(stat.sharpeRatio, 2) + " ] ";
    statSentence[6] = statString[6] + " ---> [ " + DoubleToStr(stat.stdDev / M.point, 2) + " ] ";
    statSentence[7] = statString[7] + " ---> [ " + DoubleToStr(stat.minHoldTime / 3600.0, 2) + " hrs ] ";
    statSentence[8] = statString[8] + " ---> [ " + DoubleToStr(stat.avgHoldTime / 3600.0, 2) + " hrs ] ";
    statSentence[9] = statString[9] + " ---> [ " + DoubleToStr(stat.maxHoldTime / 3600.0, 2) + " hrs ] ";
    statSentence[10] = statString[10] + " ---> [ " + DoubleToStr(stat.profitPerTime / M.point, 2) + " $/hr ]";
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+

void ResetBuffers()
{
    ArrayResize(data_row, 0);
    ArrayResize(zone, 0);
    stat = TradeStat();
    IndicatorDigits(Digits() + 1);
    IndicatorBuffers(3);
    SetIndexBuffer(0, main_buffer);
    SetIndexBuffer(1, signal_buffer);
    SetIndexBuffer(2, diff_buffer);
    IndicatorShortName(shortName);
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void showPanel()
{
    statSentenceDefine();

    double temp, arr[];
    ArrayResize(arr, statSize);

    for (int i = 0; i < statSize; i++)
    {
        arr[i] = optimization[i][4];
    }

    for (int i = 0; i < statSize; i++)
    {
        for (int j = i + 1; j < statSize; j++)
        {
            if (arr[i] < arr[j])
            {
                temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
        }
    }

    for (int i = statSize - 1; i >= 0; i--)
    {
        for (int j = statSize - 1; j >= 0; j--)
        {
            if (arr[i] == optimization[j][4])
            {
                Print(" [ Ranking ] ---> [ " + (i + 1) + " ] ---> [ " + statString[j] + " ] ---> [ " + statString[0] + " ] ---> [ " + optimization[j][4] + " ] ");
            }
        }
    }
    Print(" [ " + ((direction == 0) ? "Forward" : (direction == 1) ? "Backward"
                                                                   : "No") +
          " training ] ");
    Panel.SetPanel("navPanel", 0, 0, 30, 320, 240, clrYellow);
    // Panel.SetPanelText("txt", 0, "Training Period: " + trainFrom + " - " + trainTo, -1, -1, clrBlue);
    Panel.SetPanelText("txt", 0, "Trading Period: " + data_row[0].dt + " - " + data_row[ArraySize(data_row) - 1].dt/*(trainTo + (count - 1) * barsForNextTraining * scanRange)*/, -1, -1, clrBlue);
    Panel.SetPanelText("txt", 1, "", -1, -1, clrBlue);
    Panel.SetPanelText("txt", 2, "Best mode ---> [ " + statString[optimizedProfitMode] + " ] ", -1, -1, clrRed);
    Panel.SetPanelText("txt", 3, "", -1, -1, clrBlue);
    Panel.SetPanelText("txt", 4, "Display mode ---> [ " + statString[opt_mode] + " ] ", -1, -1, Black);
    Panel.SetPanelText("txt", 5, "", -1, -1, clrBlue);

    for (int i = 0; i < statSize / 2; i++)
    {
        Panel.SetPanelText("txt", i + 6, statSentence[i], -1, -1, clrBlack);
    }
    /*
     Panel.SetPanelText("txt", 2, "Net Profit: " + int(stat.netProfit / M.point) + "pt", -1, -1, clrBlack);
     Panel.SetPanelText("txt", 3, "Profit: " + int(stat.profit / M.point) + "pt" + " (" + DoubleToStr(stat.winRate * 100, 2) + "%)", -1, -1, clrBlack);
     Panel.SetPanelText("txt", 4, "Loss: " + int(stat.loss / M.point) + "pt" + " (" + DoubleToStr(stat.lossRate * 100, 2) + "%)", -1, -1, clrBlack);
     Panel.SetPanelText("txt", 5, "Std Dev: " + DoubleToStr(stat.stdDev / M.point, 2) + "pt", -1, -1, clrBlack);
     Panel.SetPanelText("txt", 6, "Sharpe Ratio: " + DoubleToStr(stat.sharpeRatio, 2), -1, -1, clrBlack);
     Panel.SetPanelText("txt", 7, "Hold Time (Min/Avg/Max): " + DoubleToStr(stat.minHoldTime / 3600.0, 2) + "hrs/" + DoubleToStr(stat.avgHoldTime / 3600.0, 2) + "hrs/" + DoubleToStr(stat.maxHoldTime / 3600.0, 2) + "hrs", -1, -1, clrBlack);
     Panel.SetPanelText("txt", 8, "Profit Per Hour: " + DoubleToStr(stat.profitPerTime / M.point, 2) + "pt/hr", -1, -1, clrBlack);
     */
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void ReadCSV()
{
    if (!FileIsExist(filename))
    {
        Print("READ FAILED!!");
        return;
    }
    // READ FROM DISK
    int handle = FileOpen(filename, FILE_READ | FILE_CSV, ",");
    if (handle == INVALID_HANDLE)
    {
        Print("Failed on FileOpen");
        return;
    }
    ArrayResize(data_row, 0);
    int row = 0;
    while (!FileIsEnding(handle))
    {
        string temp = FileReadString(handle);
        if (FileIsEnding(handle))
            break;
        if (row == 0)
        {
            // SKIP
        }
        else
        {
            ArrayResize(data_row, ArraySize(data_row) + 1);
            int currInd = ArraySize(data_row) - 1;

            // datetime dt = StrToTime(temp);
            // string highestP = FileReadString(handle);
            // string consistentP = FileReadString(handle);
            // Print(temp + "/" + dt + "/" + highestP + "/" + consistentP);

            data_row[currInd].dt = StrToTime(temp);
            for (int i = 0; i < statSize; i++)
            {
                data_row[currInd].overfittedData[i] = FileReadString(handle);
            }
            // Print(temp + "/" + data_row[currInd].String());
        }
        while (!FileIsLineEnding(handle))
            FileReadString(handle);
        row++;
    }
    FileClose(handle);
}

//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    Panel.Destroy();
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
class TradeZone
{
public:
    int type;
    datetime startTime, endTime;
    double highPrice, lowPrice;
    void Start(datetime st)
    {
        startTime = st;
    }
    void End(datetime ed)
    {
        endTime = ed;
        int startBar = iBarShift(NULL, 0, startTime, true);
        int endBar = iBarShift(NULL, 0, endTime, true);
        highPrice = iHigh(NULL, 0, iHighest(NULL, 0, MODE_HIGH, startBar - endBar + 1, endBar));
        lowPrice = iLow(NULL, 0, iLowest(NULL, 0, MODE_LOW, startBar - endBar + 1, endBar));
    }
    datetime Start()
    {
        return startTime;
    }
    datetime End()
    {
        return endTime;
    }
    string String() const
    {
        return "TradeZone:" + startTime + "-" + endTime + "/" + highPrice + "," + lowPrice;
    }
    void Draw()
    {
        Panel.SetRect("TradeZone" + startTime, startTime, highPrice, endTime, lowPrice, (type == OP_BUY ? clrGreen : clrRed));

        Panel.SetBarText("TradeDetail" + startTime, (profit >= 0 ? "+" : "") + NB(profit / M.point, 2) + "pt", profit >= 0 ? clrDodgerBlue : clrRed, startTime, lowPrice - 30 * M.point, 0);
        ObjectSetInteger(0, Panel.GetPrefix() + "TradeDetail" + startTime, OBJPROP_ANCHOR, ANCHOR_LEFT_UPPER);
    }

public: // STAT
    double profit;
    int holdingTime;
};
TradeZone zone[];
class TradeStat
{
public:
    double netProfit, profit, loss, winRate, lossRate;
    double sharpeRatio, stdDev;
    int minHoldTime, avgHoldTime, maxHoldTime;
    double profitPerTime;
    TradeStat()
    {
        netProfit = 0;
        profit = 0;
        loss = 0;
        winRate = 0;
        lossRate = 0;
        sharpeRatio = 0;
        stdDev = 0;
        minHoldTime = 0;
        avgHoldTime = 0;
        maxHoldTime = 0;
        profitPerTime = 0;
    }
};
TradeStat stat;

int effMACD_shift = 1;
double FindMACDDiff(const macd_data *data, const int &barIndex)
{
    ArrayResize(main_buffer, barIndex + 1);

    ArrayResize(signal_buffer, barIndex + 1);

    ArrayResize(diff_buffer, barIndex + 1);
    main_buffer[barIndex] = iMACD(NULL, 0, data.fast, data.slow, data.signal, PRICE_CLOSE, MODE_MAIN, barIndex + effMACD_shift);
    signal_buffer[barIndex] = iMACD(NULL, 0, data.fast, data.slow, data.signal, PRICE_CLOSE, MODE_SIGNAL, barIndex + effMACD_shift);
    diff_buffer[barIndex] = main_buffer[barIndex] - signal_buffer[barIndex];
    return NB(diff_buffer[barIndex] / M.pipAdj / M.point, Digits + 1);
    ;
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
double FindMACDMax(const macd_data *data, const int &startBar, const double &currDiff)
{
    // CALCULATE MAX DIFF BAR
    double MACDMaxDiff = MathAbs(currDiff);
    // FLIP MACD DIFF FOR CLEAN FORMULA
    int trend = currDiff > 0 ? 1 : currDiff < 0 ? -1
                                                : 0;
    if (trend == 0)
        return MACDMaxDiff;
    for (int i = startBar; i < Bars; i++)
    {
        // Print("1: " + i);
        double iDiff =
            trend * (iMACD(NULL, 0, data.fast, data.slow, data.signal, PRICE_CLOSE, MODE_MAIN, i + effMACD_shift) - iMACD(NULL, 0, data.fast, data.slow, data.signal, PRICE_CLOSE, MODE_SIGNAL, i + effMACD_shift)) / M.pipAdj / M.point;
        if (iDiff < 0)
            break;
        MACDMaxDiff = MathMax(MACDMaxDiff, iDiff);
    }
    // FLIP MACD DIFF BACK
    MACDMaxDiff *= trend;
    MACDMaxDiff = NB(MACDMaxDiff, Digits + 1);
    return MACDMaxDiff;
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
int GetTrend(const double &currDiff, const double &maxDiff)
{
    if (currDiff >= 0 && currDiff >= maxDiff)
        return 1;
    if (currDiff <= 0 && currDiff <= maxDiff)
        return -1;
    return 0;
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void ScanTradableZone()
{
    if (!ArraySize(data_row))
        return;
    double MACD1M, MACD1S, MACD1D;
    int startBar, endBar;
    int type = -1;
    int currZone = -1;
    // LOOP IN TIME PAIRS (r & r+1)
    for (int r = 0; r < ArraySize(data_row) - 1; r++)
    {
        // Print("2: " + r);
        macd_opt_data *row = GetPointer(data_row[r]);
        macd_data *macd_setting;

        macd_setting = GetPointer(row.overfittedData[opt_mode]);

        startBar = iBarShift(NULL, 0, data_row[r].dt);
        endBar = iBarShift(NULL, 0, data_row[r + 1].dt);
        // LOOP IN BARS
        for (int i = startBar; i >= endBar; i--)
        {
            // Print("3: " + startBar + " 123: " + endBar);
            // GET CURRENT MACD VALUES
            double currDiff = FindMACDDiff(macd_setting, i);
            double maxDiff = FindMACDMax(macd_setting, i, currDiff);
            int trend = GetTrend(currDiff, maxDiff);
            // ZONE ACTION (HAVE OPENED ZONE && NOT ZONE TREND)
            if (currZone != -1 && !zone[currZone].End() && (zone[currZone].type == OP_BUY && trend != 1 || zone[currZone].type == OP_SELL && trend != -1))
            {
                // THEN CLOSE ZONE
                zone[currZone].End(iTime(NULL, 0, i));
            }
            // ZONE ACTION (NO ZONE || ZONE CLOSED) && HAVE TREND)
            if ((currZone == -1 || zone[currZone].End() > 0) && (trend == 1 || trend == -1))
            {
                // THEN OPEN ZONE
                ArrayResize(zone, ArraySize(zone) + 1);
                currZone++;
                zone[currZone].type = trend == 1 ? OP_BUY : OP_SELL;
                zone[currZone].Start(iTime(NULL, 0, i));
            }
        }
    }
    // IF STILL ZONE OPENED AFTER LOOP
    if (currZone != -1 && !zone[currZone].End())
    {
        // THEN CLOSE ANY ZONE
        zone[currZone].End(iTime(NULL, 0, endBar));
    }
    // UPDATE DATA
    time_from = zone[0].startTime;
    time_to = zone[ArraySize(zone) - 1].endTime;
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void CalculateZoneStat()
{
    for (int i = 0; i < ArraySize(zone); i++)
    {
        // Print("4: " + i);
        // CALCULATE PROFIT/LOSS
        double openPrice = iOpen(NULL, 0, iBarShift(NULL, 0, zone[i].startTime, true));
        double closePrice = iClose(NULL, 0, iBarShift(NULL, 0, zone[i].endTime, true));
        zone[i].profit = (closePrice - openPrice) * (zone[i].type == OP_BUY ? 1 : -1);
        // CALCULATE HOLDING TIME
        zone[i].holdingTime = zone[i].endTime - zone[i].startTime;
    }
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void CalculateTotalStat()
{
    // Print("Total stat");
    stat.minHoldTime = INT_MAX;
    stat.maxHoldTime = INT_MIN;
    double mean = 0, balance = 1000, ahpr = 0;
    for (int i = 0; i < ArraySize(zone); i++)
    {

        // Print("5: " + i);
        if (zone[i].profit >= 0)
        {
            // ACCUMULATE TOTAL PROFIT
            stat.profit += zone[i].profit;
            // ACCUMULATE WIN COUNT
            stat.winRate++;
        }
        else
        {
            // ACCUMULATE TOTAL LOSS
            stat.loss -= zone[i].profit;
            // ACCUMULATE LOSS COUNT
            stat.lossRate++;
        }
        // ACCUMULATE SD
        mean += zone[i].profit;
        // FIND HOLDING TIME (MIN/MAX) & ACCUMULATE HOLDING TIME
        stat.minHoldTime = MathMin(zone[i].holdingTime, stat.minHoldTime);
        stat.maxHoldTime = MathMax(zone[i].holdingTime, stat.maxHoldTime);
        stat.avgHoldTime += zone[i].holdingTime;
        // ACCUMULATE HOLDING PERIOD RETURN (HPR) by Ralph Vince
        if (balance != 0)
            ahpr += (balance + zone[i].profit / M.point) / balance;
        balance += zone[i].profit / M.point;
    }
    // CALCULATE SD
    if (ArraySize(zone) != 0)
        mean /= ArraySize(zone);
    double variance = 0;
    for (int i = 0; i < ArraySize(zone); i++)
    {
        // Print("6: " + i);
        variance += MathPow(zone[i].profit - mean, 2);
    }
    if (ArraySize(zone) != 0)
        variance /= ArraySize(zone);
    stat.stdDev = MathSqrt(variance);
    // CALCULATE AVERAGE HOLDING PERIOD RETURN (AHPR) by Ralph Vince
    if (ArraySize(zone) != 0)
        ahpr /= ArraySize(zone);
    // CALCULATE SHARPE RATIO (AHPR-(1+RFR))/SD
    if (stat.stdDev != 0)
        stat.sharpeRatio = (ahpr - 1) / stat.stdDev;
    // CALCULATE NET PROFIT
    stat.netProfit = stat.profit - stat.loss;
    // CALCULATE WIN RATE
    if (ArraySize(zone) != 0)
        stat.winRate /= ArraySize(zone);
    // CALCULATE LOSE RATE
    if (ArraySize(zone) != 0)
        stat.lossRate /= ArraySize(zone);
    // CALCULATE PROFIT PER TIME
    if (stat.avgHoldTime != 0)
        stat.profitPerTime = stat.netProfit / (stat.avgHoldTime / 3600.0);
    // CALCULATE AVERAGE HOLDING TIME
    if (ArraySize(zone) != 0)
        stat.avgHoldTime /= ArraySize(zone);
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void calculationBundle()
{
    ResetBuffers();

    time_from = trainTo;
    time_to = trainTo + count * barsForNextTraining * scanRange;

    ReadCSV();

    ScanTradableZone();
    CalculateZoneStat();
    CalculateTotalStat();

    FileClose(handle);
}

void Logic()
{
    // DownloadCSV();
    // ReadCSV();
    // createTrades();
    // FileClose(handle);

    double optimizedProfit, temp = GlobalVariableGet("opt_mode");
    for (int i = 0; i < statSize; i++)
    {
        opt_mode = i;

        calculationBundle();

        optimization[i][4] = (stat.netProfit / M.point);
        // Print(" " + i + ": [ " + statString[i] + " ] ---> [ " + statString[0] + " ] ---> [ " + optimization[i][4] + " ] ");

        if (optimizedProfit < (stat.netProfit / M.point) || i == 0)
        {
            optimizedProfit = (stat.netProfit / M.point);
            optimizedProfitMode = i;
        }
        if (GlobalVariableGet("mode") == 0)
        {
            opt_mode = optimizedProfitMode;
        }
        else
        {
            opt_mode = temp;
        }
    }
    calculationBundle();
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void Display()
{
    RefreshRates();
    // Print("Zone Count:" + ArraySize(zone));
    for (int i = 0; i < ArraySize(data_row); i++)
    {
        // Print("7: " + i);
        macd_opt_data *row = GetPointer(data_row[i]);
        macd_data *macd_setting;

        macd_setting = GetPointer(row.overfittedData[opt_mode]);

        Panel.SetLineV2(WindowFind(shortName), "line" + i, data_row[i].dt, clrLime, macd_setting.String());
    }

    Panel.SetLineV2(WindowFind(shortName), "line" + trainFrom, trainFrom, clrRed, "Training from");
    Panel.SetLineV2(WindowFind(shortName), "line" + trainTo, trainTo, clrRed, "Training to");

    for (int i = 0; i < ArraySize(zone); i++)
    {
        // Print("8: " + i);
        // Print(zone[i].String());
        zone[i].Draw();
        // Sleep(speed);
    }
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
int OnInit()
{
    /*
        if (Period() != PERIOD_D1)
        {
            Print("Currently must be on EURUSD D1 chart");
            ChartSetSymbolPeriod(0, getSymPrefix(Symbol()) + "EURUSD" + getSymSuffix(Symbol()), PERIOD_D1);
        }*/
    fullPath = (http_protocol == 80 ? "http://" : "https://") + source + "/" + filename;
    Panel.Destroy();
    Panel.SetActive(true);

    ResetBuffers();

    return 0;
}
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
  static bool state = false;
  if (prev_calculated == 0 && state == false)
  {
    state = true;
/*
void OnStart()
{
     FileDelete(filename);
    handle = FileOpen(filename, FILE_CSV | FILE_READ | FILE_WRITE, ',');
    if (handle == 1)
    {
        switch(Period())
        {
         case PERIOD_M1:

            scanRange = 60;
            break;

         case PERIOD_M5:

            scanRange = 60 * 5;
            break;

         case PERIOD_M15:

            scanRange = 60 * 15;
            break;

         case PERIOD_M30:

            scanRange = 60 * 30;
            break;

         case PERIOD_H1:

            scanRange = 60 * 60;
            break;

         case PERIOD_H4:

            scanRange = 60 * 60 * 4;
            break;

         case PERIOD_D1:

            scanRange = 60 * 60 * 24;
            break;

         case PERIOD_W1:

            scanRange = 60 * 60 * 24 * 7;
            break;

         case PERIOD_MN1:

            scanRange = 60 * 60 * 24 * 30;
            break;
        }
        FileWrite(handle, "datetime",
                  "greatest_netProfitMode",
                  "greatest_profitMode",
                  "greatest_lossMode",
                  "greatest_winRateMode",
                  "greatest_lossRateMode",
                  "greatest_sharpeRatioMode",
                  "greatest_stdDevMode",
                  "greatest_minHoldTimeMode",
                  "greatest_avgHoldTimeMode",
                  "greatest_maxHoldTimeMode",
                  "greatest_profitPerTimeMode",
                  "smallest_netProfitMode",
                  "smallest_profitMode",
                  "smallest_lossMode",
                  "smallest_winRateMode",
                  "smallest_lossRateMode",
                  "smallest_sharpeRatioMode",
                  "smallest_stdDevMode",
                  "smallest_minHoldTimeMode",
                  "smallest_avgHoldTimeMode",
                  "smallest_maxHoldTimeMode",
                  "smallest_profitPerTimeMode");
        Panel.Destroy();*/
        
        statStringDefine();
        Logic();
        Display();
        showPanel();
        Sleep(bigValue);
    }
    else
    {
        Comment("File not found, the last error is ", GetLastError());
    }

/* } }*/
 
 return rates_total;
 }