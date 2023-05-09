//+------------------------------------------------------------------+
//|                                                 myworldbox-1.mq4 |
//|                            Copyright© copy; 2020. VL Blockchain. |
//|                                 https://www.myworldbox.github.io |
//+------------------------------------------------------------------+
#property copyright "Copyright© copy; 2020. VL Blockchain."
#property link "https://www.myworldbox.github.io"

input double TakeProfit = 50;
input double Lots = 0.1;
input double TrailingStop = 30;
input double MACDOpenLevel = 3;
input double MACDCloseLevel = 2;
input int MATrendPeriod = 26;
int buyCount = 0, sellCount = 0;
//+------------------------------------------------------------------+
//|                                                                  |
//+------------------------------------------------------------------+
void OnTick(void)
{
    double MacdCurrent, MacdPrevious;
    double SignalCurrent, SignalPrevious;
    double MaCurrent, MaPrevious;
    int cnt, ticket, total;
    //---
    // initial data checks
    // it is important to make sure that the expert works with a normal
    // chart and the user did not make any mistakes setting external
    // variables (Lots, StopLoss, TakeProfit,
    // TrailingStop) in our case, we check TakeProfit
    // on a chart of less than 100 bars
    //---
    if (Bars < 100)
    {
        Print("bars less than 100");
        return;
    }
    if (TakeProfit < 10)
    {
        Print("TakeProfit less than 10");
        return;
    }
    //--- to simplify the coding and speed up access data are put into internal variables
    MacdCurrent = iMACD(NULL, 0, 12, 26, 9, PRICE_CLOSE, MODE_MAIN, 0);
    MacdPrevious = iMACD(NULL, 0, 12, 26, 9, PRICE_CLOSE, MODE_MAIN, 1);
    SignalCurrent = iMACD(NULL, 0, 12, 26, 9, PRICE_CLOSE, MODE_SIGNAL, 0);
    SignalPrevious = iMACD(NULL, 0, 12, 26, 9, PRICE_CLOSE, MODE_SIGNAL, 1);
    MaCurrent = iMA(NULL, 0, MATrendPeriod, 0, MODE_EMA, PRICE_CLOSE, 0);
    MaPrevious = iMA(NULL, 0, MATrendPeriod, 0, MODE_EMA, PRICE_CLOSE, 1);

    MqlRates BarData[1];
    CopyRates(Symbol(), Period(), 0, 1, BarData); // Copy the data of last incomplete BAR
    double allin;
    bool state = false;

    total = OrdersTotal();

    if (MacdCurrent < 0 && MacdCurrent > SignalCurrent && MacdPrevious < SignalPrevious &&
        MathAbs(MacdCurrent) > (MACDOpenLevel * Point) && MaCurrent > MaPrevious) // buy
    {
        buyCount++;
        Print("buyCount: ", buyCount);
    }
    if (MacdCurrent > 0 && MacdCurrent < SignalCurrent && MacdPrevious > SignalPrevious &&
        MacdCurrent > (MACDOpenLevel * Point) && MaCurrent < MaPrevious)
    {
        sellCount++;
        Print(" sellCount: ", sellCount);
    }

    if (total < 1)
    {
        //--- no opened orders identified
        if (AccountFreeMargin() < (1000 * Lots))
        {
            Print("We have no money. Free Margin = ", AccountFreeMargin());
            return;
        }

        //--- check for long position (BUY) possibility
        if (buyCount < sellCount && state == false || allin >= BarData[0].close || buyCount >= 100000 && sellCount >= 100000 && state == true)
        {
            sellCount = 0;
            buyCount = 0;
            state = true;
            allin = Ask;
            ticket = OrderSend(Symbol(), OP_BUY, Lots, Ask, 3, 0, Ask + TakeProfit * Point, "macd sample", 16384, 0, Green);
            if (ticket > 0)
            {
                if (OrderSelect(ticket, SELECT_BY_TICKET, MODE_TRADES))
                    Print("BUY order opened : ", OrderOpenPrice());
            }
            else
                Print("Error opening BUY order : ", GetLastError());
            return;
        }

        //--- check for short position (SELL) possibility
        if (buyCount > sellCount && allin < BarData[0].close && state == true || BarData[0].close >= 1.5 * allin || TimeMonth(Time[0]) != TimeMonth(Time[1]) || buyCount >= 100000 && sellCount >= 100000 && state == false)
        {
            buyCount = 0;
            sellCount = 0;
            state = false;
            allin = Bid;
            ticket = OrderSend(Symbol(), OP_SELL, Lots, Bid, 3, 0, Bid - TakeProfit * Point, "macd sample", 16384, 0, Red);
            if (ticket > 0)
            {
                if (OrderSelect(ticket, SELECT_BY_TICKET, MODE_TRADES))
                    Print("SELL order opened : ", OrderOpenPrice());
            }
            else
                Print("Error opening SELL order : ", GetLastError());
        }
        //--- exit from the "no opened orders" block
        return;
    }
    //--- it is important to enter the market correctly, but it is more important to exit it correctly...
    //+------------------------------------------------------------------+
}