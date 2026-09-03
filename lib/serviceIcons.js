import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import {
  FaLaptopCode,
  FaAmazon,
  FaShopify,
  FaVectorSquare,
  FaSearch,
  FaUsers,
  FaEbay,
  FaMobileAlt,
  FaBullhorn,
  FaPenNib,
  FaCode,
  FaServer,
  FaShoppingBag,
  FaChartLine,
  FaPalette,
  FaCloud,
  FaCog,
  FaGlobe,
  FaRocket,
  FaShieldAlt,
  FaDatabase,
  FaBrain,
  FaHeadset,
} from "react-icons/fa";

/**
 * Central registry of icons usable for services.
 * Stored on each service as `icon` (the string key below).
 * Shared by the dashboard picker, navbar, homepage, and detail page,
 * so whatever an admin selects renders identically everywhere.
 */
export const SERVICE_ICONS = {
  FaLaptopCode,
  FaCartShopping,
  FaAmazon,
  FaShopify,
  FaVectorSquare,
  FaSearch,
  FaUsers,
  FaEbay,
  FaMobileAlt,
  FaBullhorn,
  FaPenNib,
  FaCode,
  FaServer,
  FaShoppingBag,
  FaChartLine,
  FaPalette,
  FaCloud,
  FaCog,
  FaGlobe,
  FaRocket,
  FaShieldAlt,
  FaDatabase,
  FaBrain,
  FaHeadset,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export const DEFAULT_SERVICE_ICON = "FaLaptopCode";

/**
 * Render a service icon by its stored name.
 * Falls back gracefully so an unknown/legacy name never crashes the UI.
 */
export function ServiceIcon({ name, className }) {
  const Icon = SERVICE_ICONS[name] || SERVICE_ICONS[DEFAULT_SERVICE_ICON];
  return <Icon className={className} />;
}
