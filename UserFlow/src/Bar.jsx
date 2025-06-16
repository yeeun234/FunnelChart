import React, { useEffect, useState } from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import mockData from './mockFunnelData';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";

const paymentColors = {
  credit_card: '#56b4e9',
  boleto: '#009e73',
  voucher: '#f0e442',
  debit_card: '#cc79a7',
};
const arr =['a','b','c']


function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const obj = Object.keys(paymentColors)

obj.forEach(x=>{
  console.log(x)
})

export default function Bar() {
 
  return (
    <>
      
    </>
  )
}
