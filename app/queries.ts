// queries.ts

export const getTopCustomersByAmountSpent = `
SELECT TOP 10
    [Customer ID],
    [Customer Name],
    SUM([Amount Paid (Transaction Currency)]) AS TotalAmountSpent
FROM 
    [suiteql].[viewInvoicePoC]
WHERE 
    [Date Created] >= DATEADD(WEEK, -20, GETDATE()) AND
    [Customer Name] IS NOT NULL
GROUP BY 
    [Customer ID],
    [Customer Name]
ORDER BY 
    TotalAmountSpent DESC;
`;

export const getTopProductsByAmountSpent = `
SELECT TOP 10
    [Item],  -- Adjust if your product identifier is different
    SUM([Amount Paid (Transaction Currency)]) AS TotalAmountSpent
FROM 
    [suiteql].[viewInvoicePoC]
WHERE 
    [Date Created] >= DATEADD(WEEK, -20, GETDATE()) AND
    [Item] IS NOT NULL
GROUP BY 
    [Item]  -- Group by the product identifier
ORDER BY 
    TotalAmountSpent DESC;
`;

export const getTopSalesRepsByAmountSpent = `
WITH SalesDistribution AS (
    SELECT 
        [Customer ID],
        [Customer Name],
        COUNT(DISTINCT [Document Number]) AS TotalOrders,
        SUM([Amount (Net) (Transaction Currency)]) AS TotalSales,
        SUM([Amount Paid (Transaction Currency)]) AS TotalPaid,
        SUM([Amount Unpaid (Transaction Currency)]) AS TotalUnpaid,
        CASE
            -- Categories based on payment status and order frequency
            WHEN COUNT(DISTINCT [Document Number]) = 1 AND SUM([Amount Unpaid (Transaction Currency)]) = 0 THEN 'New Paid Customers'
            WHEN COUNT(DISTINCT [Document Number]) = 1 AND SUM([Amount Unpaid (Transaction Currency)]) > 0 THEN 'New Unpaid Customers'
            WHEN COUNT(DISTINCT [Document Number]) BETWEEN 2 AND 3 AND SUM([Amount Unpaid (Transaction Currency)]) = 0 THEN 'Low Frequency Paid Customers'
            WHEN COUNT(DISTINCT [Document Number]) BETWEEN 2 AND 3 AND SUM([Amount Unpaid (Transaction Currency)]) > 0 THEN 'Low Frequency Unpaid Customers'
            WHEN COUNT(DISTINCT [Document Number]) BETWEEN 4 AND 5 AND SUM([Amount Unpaid (Transaction Currency)]) = 0 THEN 'Medium Frequency Paid Customers'
            WHEN COUNT(DISTINCT [Document Number]) BETWEEN 4 AND 5 AND SUM([Amount Unpaid (Transaction Currency)]) > 0 THEN 'Medium Frequency Unpaid Customers'
            WHEN COUNT(DISTINCT [Document Number]) BETWEEN 6 AND 10 AND SUM([Amount Unpaid (Transaction Currency)]) = 0 THEN 'High Frequency Paid Customers'
            WHEN COUNT(DISTINCT [Document Number]) BETWEEN 6 AND 10 AND SUM([Amount Unpaid (Transaction Currency)]) > 0 THEN 'High Frequency Unpaid Customers'
            -- Segments based on the total amount paid
            WHEN SUM([Amount Paid (Transaction Currency)]) > 20000 THEN 'Very High-Value Customers'
            WHEN SUM([Amount Paid (Transaction Currency)]) BETWEEN 10000 AND 20000 THEN 'High-Value Customers'
            WHEN SUM([Amount Paid (Transaction Currency)]) BETWEEN 5000 AND 10000 THEN 'Medium-Value Customers'
            WHEN SUM([Amount Paid (Transaction Currency)]) BETWEEN 1000 AND 5000 THEN 'Low-Value Customers'
            -- Fallback category for all others
            ELSE 'Inactive Customers'
        END AS SalesChannel
    FROM [suiteql].[viewInvoicePoC]
    WHERE [Amount Paid (Transaction Currency)] IS NOT NULL
    GROUP BY [Customer ID], [Customer Name]
),
SalesSummary AS (
    SELECT
        SalesChannel,
        COUNT(*) AS VisitorCount
    FROM SalesDistribution
    GROUP BY SalesChannel
),
Top5SalesChannels AS (
    SELECT TOP (5)
        SalesChannel,
        VisitorCount
    FROM SalesSummary
    ORDER BY VisitorCount DESC
),
TotalTop5Count AS (
    SELECT
        SUM(VisitorCount) AS TotalCount
    FROM Top5SalesChannels
)
SELECT
    t.SalesChannel,
    t.VisitorCount,
    ROUND(t.VisitorCount * 100.0 / tt.TotalCount, 1) AS Percentage
FROM Top5SalesChannels t
CROSS JOIN TotalTop5Count tt
ORDER BY t.VisitorCount DESC;

`;

export const getTotalAmountSpentPerMonth = `
WITH MonthlySales AS (
    SELECT 
        DATEPART(YEAR, [Date Created]) AS SalesYear,
        DATEPART(MONTH, [Date Created]) AS SalesMonth,
        DATEPART(QUARTER, [Date Created]) AS SalesQuarter,
        SUM([Amount Paid (Transaction Currency)]) AS TotalPaid,
        SUM([Amount Unpaid (Transaction Currency)]) AS TotalUnpaid,
        COUNT(DISTINCT [Document Number]) AS TotalTransactions,
        CASE 
            WHEN SUM([Amount Paid (Transaction Currency)]) > SUM([Amount Unpaid (Transaction Currency)]) THEN 'Positive Sales'
            WHEN SUM([Amount Paid (Transaction Currency)]) = SUM([Amount Unpaid (Transaction Currency)]) THEN 'Neutral Sales'
            ELSE 'Negative Sales'
        END AS SalesSentiment
    FROM [suiteql].[viewInvoicePoC]
    WHERE [Amount Paid (Transaction Currency)] IS NOT NULL
    GROUP BY DATEPART(YEAR, [Date Created]), DATEPART(MONTH, [Date Created]), DATEPART(QUARTER, [Date Created])
),
RankedSales AS (
    SELECT
        SalesYear,
        SalesMonth,
        SalesQuarter,
        TotalPaid,
        TotalUnpaid,
        TotalTransactions,
        SalesSentiment,
        (TotalPaid - TotalUnpaid) AS NetSales,
        ROW_NUMBER() OVER (ORDER BY (TotalPaid - TotalUnpaid) DESC) AS RowNum
    FROM MonthlySales
)
-- Final Query to select top 5 records
SELECT
    SalesYear,
    SalesMonth,
    SalesQuarter,
    TotalPaid,
    TotalUnpaid,
    TotalTransactions,
    SalesSentiment,
    NetSales
FROM RankedSales
WHERE RowNum <= 5
ORDER BY NetSales DESC;

`;

export const getTopProductsBySalesAmount = `
WITH ProductSales AS (
    -- Aggregating total sales per product from the invoice view
    SELECT 
        b.[Item] AS ProductID,
        SUM(b.[Amount (Net) (Transaction Currency)]) AS TotalSales,
        COUNT(DISTINCT a.[Document Number]) AS TotalTransactions
    FROM [suiteql].[viewInvoicePoC] a
    INNER JOIN [suiteql].[viewTransactionLine_InvoicePoC] b
    ON a.[Internal ID] = b.[Transaction]
    WHERE b.[Item] IS NOT NULL
    GROUP BY b.[Item]
),
TopProducts AS (
    -- Joining the aggregated sales with product details from the item view, excluding products with 0 sales
    SELECT 
        p.[Full Name] AS ProductName,
        p.[Category Name] AS Category,
        ps.[TotalSales],
        ps.[TotalTransactions],
        p.[Base Price],
        -- Mock rating based on total sales and base price (can adjust the criteria)
        CASE 
            WHEN ps.[TotalSales] > 100000 THEN 4.5
            WHEN ps.[TotalSales] BETWEEN 70000 AND 100000 THEN 4.0
            WHEN ps.[TotalSales] BETWEEN 40000 AND 70000 THEN 3.5
            WHEN ps.[TotalSales] BETWEEN 20000 AND 40000 THEN 3.0
            WHEN ps.[TotalSales] BETWEEN 10000 AND 20000 THEN 2.5
            WHEN ps.[TotalSales] BETWEEN 5000 AND 10000 THEN 2.0
            ELSE 1.5
        END AS ProductRating
    FROM ProductSales ps
    INNER JOIN [suiteql].[viewItemPoC] p
    ON ps.ProductID = p.[Internal ID] 
)
-- Final query to select the top 10 products by total sales, with ratings
SELECT TOP 5 
    ProductName,
    TotalSales,
    ProductRating
FROM TopProducts
ORDER BY TotalSales DESC;
`;

export const getTopProductsByUnitsSold = `
WITH ProductUnits AS (
    -- Aggregating total units sold per product, using ABS() to convert negative values to positive
    SELECT 
        b.[Item] AS ProductID,
        SUM(ABS(b.[Quantity])) AS TotalUnits
    FROM [suiteql].[viewInvoicePoC] a
    INNER JOIN [suiteql].[viewTransactionLine_InvoicePoC] b
    ON a.[Internal ID] = b.[Transaction]
    WHERE b.[Quantity] IS NOT NULL
    GROUP BY b.[Item]
),
TopProductsByUnits AS (
    -- Joining the aggregated units with product details
    SELECT 
        p.[Full Name] AS ProductName,
        p.[Category Name] AS Category,
        pu.[TotalUnits]
    FROM ProductUnits pu
    INNER JOIN [suiteql].[viewItemPoC] p
    ON pu.ProductID = p.[Internal ID]
)
-- Select the top 10 products by total units sold (absolute value)
SELECT TOP 5 
    ProductName,
    TotalUnits,
    Category
FROM TopProductsByUnits
ORDER BY TotalUnits DESC;
`;

export const getDairyMilkYieldAverage = `SELECT
Study_ID,
AVG(Milk_Yield_Gallons) AS Avg_Milk_Yield
FROM
dairy.dairy_study_info
WHERE
Study_ID IN ('MLK101', 'MLK102', 'MLK103', 'MLK104')
GROUP BY
Study_ID;`;

export const getMilkFatPercentage = `SELECT
Study_ID,
AVG(Fat_Content_Percentage) AS Avg_Milk_Fat_Percentage
FROM
dairy.dairy_study_info
WHERE
Study_ID IN ('MLK101', 'MLK102', 'MLK103', 'MLK104')
GROUP BY
Study_ID;`;
export const getLactationDuration = `SELECT
Study_ID,
COUNT(DISTINCT Date) AS Lactation_Duration_Days
FROM
dairy.dairy_study_info
WHERE
Study_ID IN ('MLK101', 'MLK102', 'MLK103', 'MLK104')
AND Milk_Yield_Gallons > 0 -- Only counting days with actual milk production
GROUP BY
Study_ID;`;
export const getDairyStudyDuration = `SELECT
Study_ID,
MAX(Period) AS Study_Duration_Weeks
FROM
dairy.dairy_study_info
WHERE
Study_ID IN ('MLK101', 'MLK102', 'MLK103', 'MLK104')GROUP BY
Study_ID;`;

export const getDairyMLK101Yield = `SELECT
s.Period AS Week, -- Assuming Period represents the week
a.Treatment,
CASE
WHEN a.Treatment = 1 THEN 'Control'
WHEN a.Treatment = 2 THEN 'High-Grain'
END AS Treatment_Type,
AVG(s.Milk_Yield_Gallons) AS Avg_Milk_Yield
FROM
dairy.dairy_study_info s
JOIN
dairy.dairy_animal_info a ON s.Cow_ID = a.Cow_ID AND s.Study_ID = a.Study_ID
WHERE
s.Study_ID = 'MLK101'
AND a.Treatment IN (1, 2) -- Only include Control (1) and High-Grain (2) treatments
AND s.Period IN (1, 4, 8, 12) -- Filter for Week 1, 4, 8, 12
GROUP BY
s.Period, a.Treatment
ORDER BY
s.Period, a.Treatment;`;

export const getDairyMLK102Yield = `
SELECT
    s.Period AS Week, -- Assuming each period represents one week
    a.Treatment,
    CASE
        WHEN a.Treatment = 1 THEN 'Control'
        WHEN a.Treatment = 2 THEN 'Grain Supplement'
        WHEN a.Treatment = 3 THEN 'Silage Supplement'
    END AS Treatment_Type,
    AVG(s.Milk_Yield_Gallons) AS Avg_Milk_Yield
FROM
    dairy.dairy_study_info s
JOIN
    dairy.dairy_animal_info a ON s.Cow_ID = a.Cow_ID AND s.Study_ID = a.Study_ID
JOIN
    dairy.dairy_feed_info f ON s.Study_ID = f.Study_ID
WHERE
    s.Study_ID = 'MLK102'
GROUP BY
    s.Period, a.Treatment
ORDER BY
    s.Period, a.Treatment;
`;

export const getDairyMLK103Yield = `
WITH Lactation_Per_Cow AS (
    SELECT
        Cow_ID,
        COUNT(DISTINCT Date) AS Lactation_Duration_Days
    FROM
        dairy.dairy_study_info
    WHERE
        Study_ID = 'MLK103'
        AND Milk_Yield_Gallons > 0 -- Only include days with milk production
    GROUP BY
        Cow_ID
)
SELECT
    f.Feed_Type, -- Feed type comes from dairy_feed_info
    AVG(s.Milk_Yield_Gallons) AS Avg_Milk_Yield,
    AVG(lc.Lactation_Duration_Days) AS Avg_Lactation_Duration
FROM
    dairy.dairy_study_info s
JOIN
    dairy.dairy_animal_info a ON s.Cow_ID = a.Cow_ID AND s.Study_ID = a.Study_ID
JOIN
    dairy.dairy_feed_info f ON s.Study_ID = f.Study_ID -- Joining with feed info to get Feed_Type
JOIN
    Lactation_Per_Cow lc ON s.Cow_ID = lc.Cow_ID
WHERE
    s.Study_ID = 'MLK103'
    AND s.Period IN (1, 4, 8, 12)
GROUP BY
    f.Feed_Type
ORDER BY
    f.Feed_Type;
`;

export const getDairyMLK104Yield = `
  SELECT
    a.Type AS Cow_Type, -- Jersey or Holstein from animal_info table
    AVG(s.Fat_Content_Percentage) AS Avg_Milk_Fat_Percentage, -- Average Fat Content Percentage
    AVG(s.Milk_Yield_Gallons) AS Avg_Milk_Yield -- Average Milk Yield in Gallons/Day
  FROM
    dairy.dairy_study_info AS s
  JOIN
    dairy.dairy_animal_info AS a ON s.Cow_ID = a.Cow_ID AND s.Study_ID = a.Study_ID
  JOIN
    dairy.dairy_feed_info AS f ON s.Study_ID = f.Study_ID
  WHERE
    s.Study_ID = 'MLK104' -- Study MLK104 for this query
  GROUP BY
    a.Type -- Grouping by cow type (Jersey, Holstein)
  ORDER BY
    a.Type;
`;




export const getBeefYieldAverage = `
WITH Weight_Gain_Per_Calf AS (
    SELECT
        Tag_ID,
        MIN(Weight_Lbs) AS Initial_Weight,
        MAX(Weight_Lbs) AS Final_Weight
    FROM
        beef.beef_animal_info
    WHERE
        Study_ID IN ('BC500', 'BC501', 'CF717', 'CF718')
    GROUP BY
        Tag_ID
)
SELECT
    a.Study_ID,
    AVG((wg.Final_Weight - wg.Initial_Weight) / 84.0) AS Avg_Weight_Gain_Per_Day
FROM
    Weight_Gain_Per_Calf wg
JOIN
    beef.beef_animal_info a ON wg.Tag_ID = a.Tag_ID
GROUP BY
    a.Study_ID;
`;
export const getBeefConversationRatio = `
WITH Weight_Gain_Per_Calf AS (
    SELECT
    Tag_ID,
    MIN(Weight_Lbs) AS Initial_Weight,
    MAX(Weight_Lbs) AS Final_Weight
    FROM
    beef.beef_animal_info
    WHERE
    Study_ID IN ('CF717', 'CF718')
    GROUP BY
    Tag_ID
    )
    SELECT
    f.Study_ID,
    SUM(f.SUM_Period_Consumption) / SUM(wg.Final_Weight - wg.Initial_Weight) AS
    Feed_Conversion_Ratio
    FROM
    beef.beef_feed_info f
    JOIN
    beef.beef_animal_info a ON f.Study_ID = a.Study_ID
    JOIN
    Weight_Gain_Per_Calf wg ON a.Tag_ID = wg.Tag_ID
    WHERE
    f.Study_ID IN ('CF717', 'CF718')
    GROUP BY
    f.Study_ID;
`;


export const getBeefCF717CaseStudy = `
WITH Weight_Gain_Per_Calf AS (
    SELECT
        Tag_ID,
        MIN(Weight_Lbs) AS Initial_Weight,
        MAX(Weight_Lbs) AS Final_Weight
    FROM
        beef.beef_animal_info
    WHERE
        Study_ID = 'CF717'
    GROUP BY
        Tag_ID
)
SELECT
    s.Period AS Week, -- Assuming each period represents 1 week
    a.Treatment,
    AVG(f.AVG_Period_Consumption) AS Feed_Intake_Per_Day,
    AVG(wg.Final_Weight - wg.Initial_Weight) / 84 AS Weight_Gain_Per_Day, -- 84 days
    AVG(f.AVG_Period_Consumption) /
    NULLIF(AVG(wg.Final_Weight - wg.Initial_Weight) / 84, 0) AS Feed_Efficiency
FROM
    beef.beef_feed_info f
JOIN
    beef.beef_study_info s ON f.Study_ID = s.Study_ID
    AND f.study_period = s.Period -- Added join condition for period
JOIN
    beef.beef_animal_info a ON s.Study_ID = a.Study_ID
    AND s.Tag_ID = a.Tag_ID
JOIN
    Weight_Gain_Per_Calf wg ON a.Tag_ID = wg.Tag_ID
WHERE
    f.Study_ID = 'CF717'
GROUP BY
    s.Period,
    a.Treatment
ORDER BY
    s.Period;`;


export const getBeefCF718CaseStudy = `
    WITH Weight_Gain_Per_Calf AS (
        SELECT
            Tag_ID,
            MIN(Weight_Lbs) AS Initial_Weight,
            MAX(Weight_Lbs) AS Final_Weight
        FROM
            beef.beef_animal_info
        WHERE
            Study_ID = 'CF718'
        GROUP BY
            Tag_ID
    )
    SELECT
        f.study_period AS Week, -- Week (study_period) of the study
        a.Treatment, -- Treatment group (Control, Standard Grazing, etc.)
        AVG(wg.Final_Weight - wg.Initial_Weight) / 84 AS Weight_Gain_Per_Day -- Weight gain per day over 12 weeks
    FROM
        beef.beef_feed_info f
    JOIN
        beef.beef_animal_info a ON f.Study_ID = a.Study_ID AND f.Study_ID = 'CF718'
    JOIN
        beef.beef_study_info s ON a.Tag_ID = s.Tag_ID
    JOIN
        Weight_Gain_Per_Calf wg ON a.Tag_ID = wg.Tag_ID
    WHERE
        f.Study_ID = 'CF718' AND f.study_period IN (1, 4, 8)
    GROUP BY
        f.study_period, a.Treatment;`;

export const getBeefCF500CaseStudy = `
        WITH Weight_Gain_Per_Calf AS (
            SELECT
                Tag_ID,
                MIN(Weight_Lbs) AS Initial_Weight,
                MAX(Weight_Lbs) AS Final_Weight
            FROM
                beef.beef_animal_info
            WHERE
                Study_ID = 'BC500'
            GROUP BY
                Tag_ID
        )
        SELECT
            f.study_period AS Week, -- Week of the study
            a.Treatment, -- Treatment group
            AVG(f.AVG_Period_Consumption) AS Feed_Intake_Per_Day, -- Average feed intake per day
            AVG(wg.Final_Weight - wg.Initial_Weight) / 84 AS Weight_Gain_Per_Day, -- Average weight gain per day (over 12 weeks)
            AVG(f.AVG_Period_Consumption) /
            NULLIF(AVG(wg.Final_Weight - wg.Initial_Weight) / 84, 0) AS Feed_Efficiency -- Feed efficiency
        FROM
            beef.beef_feed_info f
        JOIN
            beef.beef_animal_info a ON f.Study_ID = a.Study_ID AND f.Study_ID = 'BC500'
        JOIN
            beef.beef_study_info s ON a.Tag_ID = s.Tag_ID
        JOIN
            Weight_Gain_Per_Calf wg ON a.Tag_ID = wg.Tag_ID
        WHERE
            f.Study_ID = 'BC500'
            AND f.study_period IN (1, 4, 8, 12) -- Weeks 1, 4, 8, 12 for bi-weekly monitoring
        GROUP BY
            f.study_period, a.Treatment;`;

export const getBeefAnimalInfoForTable = `WITH Pattern_Base AS (
    SELECT 
        [id],
        [Tag_ID],
        [Study_ID],
        [Treatment],
        [Pen_ID],
        [Gate_ID],
        [Animal_Count],
        [Feed_type],
        [Source],
        [Weight_Lbs],
        -- Calculate Z-scores for both weight and animal count
        (Weight_Lbs - AVG(Weight_Lbs) OVER()) / 
            NULLIF(STDEV(Weight_Lbs) OVER(), 0) AS Weight_Z_Score,
        (Animal_Count - AVG(CAST(Animal_Count AS FLOAT)) OVER()) / 
            NULLIF(STDEV(CAST(Animal_Count AS FLOAT)) OVER(), 0) AS Count_Z_Score
    FROM [beef].[beef_animal_info]
    WHERE Weight_Lbs IS NOT NULL 
    AND Animal_Count IS NOT NULL
),
Z_Scores AS (
    SELECT 
        *,
        CASE
            WHEN ABS(Weight_Z_Score) <= 1.0 
                AND ABS(Count_Z_Score) <= 1.0 THEN 'Normal'
            WHEN ABS(Weight_Z_Score) > 2.0 
                OR ABS(Count_Z_Score) > 2.0 THEN 'Anomaly'
            ELSE 'Outlier'
        END AS Animal_Pattern_Category,
        ROW_NUMBER() OVER(PARTITION BY 
            CASE
                WHEN ABS(Weight_Z_Score) <= 1.0 
                    AND ABS(Count_Z_Score) <= 1.0 THEN 'Normal'
                WHEN ABS(Weight_Z_Score) > 2.0 
                    OR ABS(Count_Z_Score) > 2.0 THEN 'Anomaly'
                ELSE 'Outlier'
            END
            ORDER BY id) AS Pattern_Row_Num
    FROM Pattern_Base
)
SELECT 
    'animal_info' AS [File Name],
    'Weight_lbs' AS [Data Point Type],
    Weight_Z_Score AS [Data Point Value],
    Weight_Lbs AS [ZScore],
	Animal_Pattern_Category
FROM Z_Scores
WHERE Pattern_Row_Num = 1
ORDER BY 
    CASE Animal_Pattern_Category 
        WHEN 'Normal' THEN 1 
        WHEN 'Outlier' THEN 2 
        WHEN 'Anomaly' THEN 3 
    END;`;

export const getBeefStudyInfoForTable = `WITH Z_Scores AS (
    SELECT 
        [id],
        [Study_ID],
        [Pen_ID],
        [Date],
        [Rep],
        [Period],
        [Tag_ID],
        -- Calculate Z-scores for Rep and Period
        (Rep - AVG(CAST(Rep AS FLOAT)) OVER()) / 
            NULLIF(STDEV(CAST(Rep AS FLOAT)) OVER(), 0) AS Rep_Z_Score,
        (Period - AVG(CAST(Period AS FLOAT)) OVER()) / 
            NULLIF(STDEV(CAST(Period AS FLOAT)) OVER(), 0) AS Period_Z_Score,
        -- Calculate days between entries per Study_ID and Tag_ID
        DATEDIFF(DAY, LAG([Date]) OVER(PARTITION BY Study_ID, Tag_ID ORDER BY [Date]), [Date]) AS Days_Between_Entries,
        -- Categorize based on combined Z-scores
        CASE
            WHEN ABS((Rep - AVG(CAST(Rep AS FLOAT)) OVER()) / 
                NULLIF(STDEV(CAST(Rep AS FLOAT)) OVER(), 0)) <= 1.0 
                AND ABS((Period - AVG(CAST(Period AS FLOAT)) OVER()) / 
                NULLIF(STDEV(CAST(Period AS FLOAT)) OVER(), 0)) <= 1.0 THEN 'Normal'
            WHEN ABS((Rep - AVG(CAST(Rep AS FLOAT)) OVER()) / 
                NULLIF(STDEV(CAST(Rep AS FLOAT)) OVER(), 0)) > 2.0 
                OR ABS((Period - AVG(CAST(Period AS FLOAT)) OVER()) / 
                NULLIF(STDEV(CAST(Period AS FLOAT)) OVER(), 0)) > 2.0 THEN 'Anomaly'
            ELSE 'Outlier'
        END AS Study_Pattern_Category
    FROM [beef].[beef_study_info]
    WHERE Rep IS NOT NULL 
    AND Period IS NOT NULL
)
SELECT 
    'study_info' AS [File Name],
	'rep' as [Data Point Type],
    AVG(CAST(Rep AS FLOAT)) AS [Data Point Value],
    MIN(Rep_Z_Score) AS ZScore,
	Study_Pattern_Category as [Classification]
FROM Z_Scores
GROUP BY Study_Pattern_Category
ORDER BY 
    CASE Study_Pattern_Category 
        WHEN 'Normal' THEN 1 
        WHEN 'Outlier' THEN 2 
        WHEN 'Anomaly' THEN 3 
    END;`;



export const getDairyAnimalInfoForTable = `WITH Z_Scores AS (
    SELECT 
        [id],
        [Cow_ID],
        [Study_ID],
        [Treatment],
        [Pen_ID],
        [Gate_ID],
        [Milk_Production_Lbs],
        [Milk_Fat_Percentage],
        [Animal_Count],
        [Type],
        [Weight_Lbs],
        -- Calculate Z-scores for milk production, fat percentage, and weight
        (Milk_Production_Lbs - AVG(Milk_Production_Lbs) OVER(PARTITION BY Type)) / 
            NULLIF(STDEV(Milk_Production_Lbs) OVER(PARTITION BY Type), 0) AS Production_Z_Score,
        (Milk_Fat_Percentage - AVG(Milk_Fat_Percentage) OVER(PARTITION BY Type)) / 
            NULLIF(STDEV(Milk_Fat_Percentage) OVER(PARTITION BY Type), 0) AS Fat_Z_Score,
        (Weight_Lbs - AVG(Weight_Lbs) OVER(PARTITION BY Type)) / 
            NULLIF(STDEV(Weight_Lbs) OVER(PARTITION BY Type), 0) AS Weight_Z_Score,
        -- Categorize based on combined Z-scores
        CASE
            WHEN ABS((Milk_Production_Lbs - AVG(Milk_Production_Lbs) OVER(PARTITION BY Type)) / 
                    NULLIF(STDEV(Milk_Production_Lbs) OVER(PARTITION BY Type), 0)) <= 1.0 
                AND ABS((Milk_Fat_Percentage - AVG(Milk_Fat_Percentage) OVER(PARTITION BY Type)) / 
                    NULLIF(STDEV(Milk_Fat_Percentage) OVER(PARTITION BY Type), 0)) <= 1.0
                AND ABS((Weight_Lbs - AVG(Weight_Lbs) OVER(PARTITION BY Type)) / 
                    NULLIF(STDEV(Weight_Lbs) OVER(PARTITION BY Type), 0)) <= 1.0 THEN 'Normal'
            WHEN ABS((Milk_Production_Lbs - AVG(Milk_Production_Lbs) OVER(PARTITION BY Type)) / 
                    NULLIF(STDEV(Milk_Production_Lbs) OVER(PARTITION BY Type), 0)) > 2.0 
                OR ABS((Milk_Fat_Percentage - AVG(Milk_Fat_Percentage) OVER(PARTITION BY Type)) / 
                    NULLIF(STDEV(Milk_Fat_Percentage) OVER(PARTITION BY Type), 0)) > 2.0
                OR ABS((Weight_Lbs - AVG(Weight_Lbs) OVER(PARTITION BY Type)) / 
                    NULLIF(STDEV(Weight_Lbs) OVER(PARTITION BY Type), 0)) > 2.0 THEN 'Anomaly'
            ELSE 'Outlier'
        END AS Dairy_Pattern_Category
    FROM [dairy].[dairy_animal_info]
    WHERE Milk_Production_Lbs IS NOT NULL 
    AND Milk_Fat_Percentage IS NOT NULL
    AND Weight_Lbs IS NOT NULL
)
SELECT 
	'animal_info' as [File Name],
	'milk_fat_percentagae' as [Data Point Type],
    AVG(Milk_Fat_Percentage) AS [Data Point Value],
    AVG(Fat_Z_Score) AS ZScore,
	Dairy_Pattern_Category AS [Classification]
FROM Z_Scores
GROUP BY Dairy_Pattern_Category
ORDER BY 
    CASE Dairy_Pattern_Category 
        WHEN 'Normal' THEN 1 
        WHEN 'Outlier' THEN 2 
        WHEN 'Anomaly' THEN 3 
    END;`;

export const getDairyStudyInfoForTable = `WITH Z_Scores AS (
    SELECT 
        [id],
        [Study_ID],
        [Pen_ID],
        [Date],
        [Rep],
        [Period],
        [Cow_ID],
        [Milk_Yield_Gallons],
        [Fat_Content_Percentage],
        -- Calculate time between measurements per cow
        DATEDIFF(DAY, LAG([Date]) OVER(PARTITION BY Cow_ID ORDER BY [Date]), [Date]) AS Days_Between_Measurements,
        -- Calculate Z-scores for milk yield and fat content
        (Milk_Yield_Gallons - AVG(Milk_Yield_Gallons) OVER(PARTITION BY Period)) / 
            NULLIF(STDEV(Milk_Yield_Gallons) OVER(PARTITION BY Period), 0) AS Yield_Z_Score,
        (Fat_Content_Percentage - AVG(Fat_Content_Percentage) OVER(PARTITION BY Period)) / 
            NULLIF(STDEV(Fat_Content_Percentage) OVER(PARTITION BY Period), 0) AS Fat_Z_Score,
        -- Categorize based on combined Z-scores
        CASE
            WHEN ABS((Milk_Yield_Gallons - AVG(Milk_Yield_Gallons) OVER(PARTITION BY Period)) / 
                    NULLIF(STDEV(Milk_Yield_Gallons) OVER(PARTITION BY Period), 0)) <= 1.0 
                AND ABS((Fat_Content_Percentage - AVG(Fat_Content_Percentage) OVER(PARTITION BY Period)) / 
                    NULLIF(STDEV(Fat_Content_Percentage) OVER(PARTITION BY Period), 0)) <= 1.0 THEN 'Normal'
            WHEN ABS((Milk_Yield_Gallons - AVG(Milk_Yield_Gallons) OVER(PARTITION BY Period)) / 
                    NULLIF(STDEV(Milk_Yield_Gallons) OVER(PARTITION BY Period), 0)) > 2.0 
                OR ABS((Fat_Content_Percentage - AVG(Fat_Content_Percentage) OVER(PARTITION BY Period)) / 
                    NULLIF(STDEV(Fat_Content_Percentage) OVER(PARTITION BY Period), 0)) > 2.0 THEN 'Anomaly'
            ELSE 'Outlier'
        END AS Study_Pattern_Category
    FROM [dairy].[dairy_study_info]
    WHERE Milk_Yield_Gallons IS NOT NULL 
    AND Fat_Content_Percentage IS NOT NULL
    AND [Date] IS NOT NULL
)
SELECT 
    'study_info' as [File Name],
	'avg_milk_yield_gallons' as [Data Point Type],
    AVG(Milk_Yield_Gallons) AS [Data Point Value],
    AVG(Yield_Z_Score) AS ZScore,
	Study_Pattern_Category as [Classification]
FROM Z_Scores
GROUP BY Study_Pattern_Category
ORDER BY 
    CASE Study_Pattern_Category 
        WHEN 'Normal' THEN 1 
        WHEN 'Outlier' THEN 2 
        WHEN 'Anomaly' THEN 3 
    END;`


















