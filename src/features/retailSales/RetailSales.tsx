import { useEffect, useState } from "react"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchSalesDataAsync,
  selectRetailSalesStatus,
  selectRetailSalesData,
} from "./retailSalesSlice"
import styles from "./RetailSales.module.css"
import { RetailSalesData, Sale } from "./retailSalesTypes";
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis } from 'recharts';

const RetailItem = ({ retailSalesData }: { retailSalesData: RetailSalesData }) => {
  return (
    <div className={styles.itemData}>
      <img className={styles.itemDataImage} src={retailSalesData.image} />
      <div className={styles.itemDataTitle}>{retailSalesData.title}</div>
      <div className={styles.itemDataSubtitle}>{retailSalesData.subtitle}</div>
      <div className={styles.itemDataTags}>
        {retailSalesData.tags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </div>
    </div>
  );
};

const shortenedMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RetailSalesGraph = ({ retailSalesData }: { retailSalesData: RetailSalesData }) => {
  const data = retailSalesData.sales.map((sale: Sale) => {
    return {
      name: sale.weekEnding,
      retailSales: sale.retailSales,
      wholesaleSales: sale.wholesaleSales,
    }
  });

  return (
    <div>
      <div className={styles.salesGraphTitle}>
        Retail Sales
      </div>
      <div>
        <ResponsiveContainer aspect={16 / 6}>
          <LineChart data={data} margin={{ top: 0, right: 25, bottom: 0, left: 25 }}>
            <Line type="monotone" dataKey="retailSales" stroke="skyblue" strokeWidth={4} dot={false}/>
            <Line type="monotone" dataKey="wholesaleSales" stroke="lightgrey" strokeWidth={4} dot={false}/>
            <YAxis domain={([dataMin, dataMax]) => {
              const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax));
              return [-absMax * 3, absMax * 3];
            }}
            hide={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.salesGraphLabel}>
        {shortenedMonths.map((month, index) => {
          return <span key={index}>{month}</span>;
        })}
      </div>
    </div>
  );
}

export const RetailSales = () => {
  const dispatch = useAppDispatch()
  const retailSalesData = useAppSelector(selectRetailSalesData)
  const retailSalesStatus = useAppSelector(selectRetailSalesStatus)

  useEffect(() => {
    if (retailSalesStatus === 'loading') {
      dispatch(fetchSalesDataAsync("mock"))
    }
  }, [retailSalesStatus, dispatch])

  return (
    <div className={styles.container}>
      <div className={styles.itemDataCard}>
        {retailSalesStatus === "loading" ? (
          <div>Loading...</div>
        ) : retailSalesStatus === "failed" ? (
          <div>Failed to load data</div>
        ) : retailSalesData !== null ? (
          <RetailItem retailSalesData={retailSalesData} />
        ) : null}
      </div>
      <div className={styles.salesGraphCard}>
        {retailSalesStatus === "loading" ? (
          <div>Loading...</div>
        ) : retailSalesStatus === "failed" ? (
          <div>Failed to load data</div>
        ) : retailSalesData !== null ? (
          <RetailSalesGraph retailSalesData={retailSalesData} />
        ) : null}
      </div>
    </div>
  )
}
