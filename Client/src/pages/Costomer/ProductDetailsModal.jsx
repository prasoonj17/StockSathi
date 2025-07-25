
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

export default function ProductDetailsModal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/*<Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>*/}

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-zinc-900 dark:text-white"
                  >
                    Product Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div><strong>🧾 Name:</strong> {product.productName}</div>
                  <div><strong>📦 SKU:</strong> {product.sku || "N/A"}</div>
                  <div><strong>🏷️ Brand:</strong> {product.brand || "N/A"}</div>
                  <div><strong>📂 Category:</strong> {product.category}</div>
                  <div><strong>📁 Subcategory:</strong> {product.subcategory || "N/A"}</div>
                  <div><strong>📦 Quantity:</strong> {product.quantity}</div>
                  <div><strong>📐 Unit:</strong> {product.unitType}</div>
                  <div><strong>💰 Selling Price:</strong> ₹{product.sellingPrice}</div>
                  <div><strong>🛒 Purchase Price:</strong> ₹{product.purchasePrice}</div>
                  <div><strong>💰 Total Selling Price:</strong> ₹{product.totalSellingPrice}</div>
                  <div><strong>🛒 Purchase Price:</strong> ₹{product.totalPurchasePrice}</div>
                  <div><strong>🎯 Discount:</strong> {product.discount || 0}%</div>
                  <div><strong>⚠️ Min Stock Alert:</strong> {product.minStockAlert || 0}</div>
                  <div><strong>📊 Stock Status:</strong> {product.stockStatus}</div>
                  <div><strong>📅 Created:</strong> {new Date(product.createdAt).toLocaleString()}</div>
                  <div className="flex flex-col gap-2">
                    <strong>🔍 Barcode:</strong>
                    {product.barcode ? (
                      <img
                        src={product.barcode}
                        alt="Barcode"
                        className="h-20 object-contain border border-zinc-300 dark:border-zinc-700 rounded-md"
                      />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
