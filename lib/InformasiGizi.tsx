import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface NilaiGiziItem {
  label: string;
  amount: string;
  dailyValue?: string;
}

export interface VitaminGiziItem {
  vitamin: string;
  dailyValue: string;
}

interface InformasiNilaiGiziProps {
  bgColor?: string;
  textColor?: string;
  content: NilaiGiziItem[];
  vitamins?: VitaminGiziItem[];
}

const InformasiNilaiGizi = ({
  content,
  vitamins = [],
}: InformasiNilaiGiziProps) => {
  return (
    <div>
      <h1 className="font-bold uppercase">
        Informasi Nilai GIZI
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Table className="bg-white p-3 rounded-sm mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-600 font-bold">Zat Gizi</TableHead>
            <TableHead className="text-right text-gray-600 font-bold">Jumlah</TableHead>
            <TableHead className="text-right text-gray-600 font-bold">%AKG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((item) => (
            <TableRow key={item.label}>
              <TableCell className="font-medium text-gray-600">
                {item.label}
              </TableCell>
              <TableCell className="text-right text-gray-600">
                {item.amount}
              </TableCell>
              <TableCell className="text-right text-gray-600">
                {item.dailyValue ?? "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {vitamins.length > 0 ? (
        <Table className="bg-white p-3 rounded-sm mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-600 font-bold ">Kandungan Vitamin</TableHead>
              <TableHead className="text-right text-gray-600 font-bold">%AKG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vitamins.map((item) => (
              <TableRow key={item.vitamin}>
                <TableCell className="font-medium text-gray-600">
                  Vitamin {item.vitamin}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {item.dailyValue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
      </div>
    </div>
  );
};
export default InformasiNilaiGizi;
