import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const ClothingSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    clothingType: [],
    color: [],
    size: [],
    gender: [],
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}clothingassignments/summary`);
        setSummary(res.data);
      } catch (err) {
        console.error("❌ Błąd pobierania zestawienia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Tu definiujemy kolejność rozmiarów „literowych”
  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Funkcja do customowego sortowania rozmiarów
  const customSortSizes = (a, b) => {
    // Sprawdź, czy a i b należą do listy literowych rozmiarów
    const aIndex = SIZE_ORDER.indexOf(a);
    const bIndex = SIZE_ORDER.indexOf(b);

    // Jeśli oba są w tablicy SIZE_ORDER
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // Jeśli tylko a jest w tablicy, a b nie
    if (aIndex !== -1 && bIndex === -1) {
      return -1; // a przed b
    }

    // Jeśli tylko b jest w tablicy, a a nie
    if (aIndex === -1 && bIndex !== -1) {
      return 1; // b przed a
    }

    // Jeśli żaden nie jest w tablicy rozmiarów literowych,
    // sprawdzamy, czy da się je zamienić na liczby (rozmiary butów)
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);

    // Jeśli obie wartości są liczbami, sortujemy rosnąco
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    // Fallback: jeśli tu trafimy, sortujemy alfabetycznie
    return a.localeCompare(b);
  };

  // Funkcja zwracająca unikatowe wartości dla danego klucza
  // i sortująca je w zależności od klucza (np. clothingType, size)
  const uniqueValues = (key) => {
    const values = [
      ...new Set(summary.map((item) => item[key]).filter(Boolean)),
    ];

    if (key === "clothingType") {
      // Sortowanie alfabetyczne
      return values.sort((a, b) => a.localeCompare(b));
    }

    if (key === "size") {
      // Używamy customSortSizes
      return values.sort(customSortSizes);
    }

    // Domyślnie brak sortowania lub sortowanie alfabetyczne (opcjonalne)
    return values;
  };

  // Funkcja toggleFilter:
  // dodaje/usuwa wartości z tablicy filtrów (np. gdy user klika)
  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  // Filtruje dane w zależności od zaznaczonych wartości w state.filters
  const applyFilters = (data) => {
    return data.filter((item) => {
      const matchesType =
        filters.clothingType.length === 0 ||
        filters.clothingType.includes(item.clothingType);
      const matchesColor =
        filters.color.length === 0 || filters.color.includes(item.color);
      const matchesSize =
        filters.size.length === 0 || filters.size.includes(item.size);
      const matchesGender =
        filters.gender.length === 0 || filters.gender.includes(item.gender);
      return matchesType && matchesColor && matchesSize && matchesGender;
    });
  };

  // Klasa kolorystyczna dla przykładu (możesz tu zostawić własne warunki)
  const getColorClass = (value) => {
    switch (value) {
      case "GAZY":
        return "bg-blue-600 text-white";
      case "OKNA":
        return "bg-gray-500 text-white";
      case "PPOŻ":
        return "bg-red-600 text-white";
      case "Brak":
        return "bg-white text-black";
      default:
        return "";
    }
  };

  const filteredData = applyFilters(summary);

  if (loading) return <div className="p-6 text-white">Ładowanie...</div>;

  const filterLabels = {
    clothingType: "Rodzaj ubrania",
    color: "Kolor ubrania",
    size: "Rozmiar",
    gender: "Płeć",
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Zestawienie zapotrzebowania</h2>

      {/* 🔍 Filtry */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.keys(filters).map((key) => (
          <Popover key={key}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-gray-700 text-white"
              >
                {filterLabels[key]} ({filters[key].length || "wszystkie"})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0 bg-white text-black">
              <Command>
                <CommandInput
                  placeholder={`Szukaj w ${filterLabels[key].toLowerCase()}`}
                />
                <CommandEmpty>Brak wyników</CommandEmpty>
                <CommandGroup>
                  {uniqueValues(key).map((val) => (
                    <CommandItem
                      key={val}
                      onSelect={() => toggleFilter(key, val)}
                      className="flex items-center space-x-2 py-2"
                    >
                      <div
                        className={`w-4 h-4 rounded-sm border border-gray-400 shrink-0 ${
                          filters[key].includes(val)
                            ? "bg-green-600"
                            : "bg-black"
                        }`}
                      ></div>
                      <span>{val}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {/* 🔄 Reset filtrów */}
      <div className="mb-4">
        <Button
          variant="destructive"
          onClick={() =>
            setFilters({ clothingType: [], color: [], size: [], gender: [] })
          }
        >
          Resetuj filtry
        </Button>
      </div>

      {/* 📋 Tabela */}
      <table className="w-full table-auto border bg-gray-800 rounded">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Rodzaj ubrania</th>
            <th className="px-4 py-2 text-left">Kolor ubrania</th>
            <th className="px-4 py-2 text-left">Rozmiar</th>
            <th className="px-4 py-2 text-left">Płeć</th>
            <th className="px-4 py-2 text-left">Ilość do zakupu</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-4 text-center text-gray-400">
                Brak braków do uzupełnienia 🎉
              </td>
            </tr>
          ) : (
            filteredData.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="px-4 py-2">{item.clothingType}</td>
                <td className={`px-4 py-2 ${getColorClass(item.color)}`}>
                  {item.color}
                </td>
                <td className="px-4 py-2">{item.size}</td>
                <td className="px-4 py-2">{item.gender}</td>
                <td className="px-4 py-2 font-semibold">{item.quantity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClothingSummary;
