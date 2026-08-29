import { useEffect, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import Membership_form_Revised from "../assets/publications/Membership-Form-Revised.pdf";
import NominationForm from "../assets/publications/NominationForm.doc";
import ProxyForm from "../assets/publications/ProxyForm.doc";
import Download from "../generic/download.component";
import PdfButton from "../generic/pdf-button.component";
import { API_BASE } from "../config/api";

// ─── Types ───────────────────────────────────────────────────────

interface Publication {
  Id: number;
  Title: string;
  Year: number;
  Month: number;
  Description: string | null;
  PdfUrl: string;
}

interface YearGroup {
  year: number;
  publications: Publication[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Helpers ────────────────────────────────────────────────────

const handleOpenPdf = (pdfUrl: string) => {
  window.open(`${API_BASE}${pdfUrl}`, "_blank");
};

const handleDownloadFile = (fileUrl: string, fileName: string) => {
  fetch(fileUrl).then((res) => {
    res.blob().then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const aLink = document.createElement("a");
      aLink.href = blobUrl;
      aLink.download = fileName;
      aLink.click();
    });
  });
};

// ─── Component ───────────────────────────────────────────────────

const Publications = () => {
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
  const [constitutionPubs, setConstitutionPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/publications`);
        if (!res.ok) throw new Error("Failed to load publications.");
        const data: Publication[] = await res.json();

        // Separate Constitution documents from regular newsletters
        const newsletters = data.filter(
          (pub: Publication) => !pub.Title.toLowerCase().includes("constitution")
        );
        const constitutionDocs = data.filter(
          (pub: Publication) => pub.Title.toLowerCase().includes("constitution")
        );
        setConstitutionPubs(constitutionDocs);

        // Group newsletters by year, sorted descending
        const grouped = new Map<number, Publication[]>();
        for (const pub of newsletters) {
          if (!grouped.has(pub.Year)) {
            grouped.set(pub.Year, []);
          }
          grouped.get(pub.Year)!.push(pub);
        }

        const groups: YearGroup[] = Array.from(grouped.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([year, publications]) => ({
            year,
            publications: publications.sort((a, b) => a.Month - b.Month),
          }));

        setYearGroups(groups);
      } catch (err: any) {
        setError(err.message || "Failed to load publications.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <>
      <div className="pb-5">
        <div
          className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5 my-5"
        >
          <div className="flex m-auto">
            <section className="py-10 px-5 w-[100%]">
              <div className="flex flex-col md:flex-row m1-auto justify-around">
                <div>
                  {loading && (
                    <div className="text-center py-10 text-lg">
                      Loading publications...
                    </div>
                  )}

                  {error && (
                    <div className="text-center py-10 text-lg text-red-600">
                      {error}
                    </div>
                  )}

                  {!loading && !error && yearGroups.length === 0 && (
                    <div className="text-center py-10 text-lg text-gray-400">
                      No publications available.
                    </div>
                  )}

                  {yearGroups.map((group) => (
                    <div
                      key={group.year}
                      className="flex flex-col md:flex-row shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] w-[100%]
                                 my-4 rounded-[14px] bg-[#B222] text-[#7F1734] items-center border-white md:w-[95%] lg:w-[100%]"
                    >
                      <div
                        className="mx-4 md:mx-10 my-5 flex-col items-center m-auto text-center
                                   text-sm md:text-[1.0em] lg:text-[1.0em] xl:text-[1.3em] 2xl:text-[1.3em]"
                      >
                        <div className="flex items-center w-[100%]">
                          <div className="mx-auto">{group.year}</div>
                        </div>
                        <hr className="border-1 border-[#800020] p-2" />
                        <div className="flex justify-between flex-col md:flex-row w-[100%] px-2">
                          {group.publications.length === 0 && (
                            <div>No publications for this year</div>
                          )}

                          {group.publications.map((pub) => (
                            <PdfButton
                              key={pub.Id}
                              label={MONTH_NAMES[pub.Month - 1] || `Month ${pub.Month}`}
                              onClick={() => handleOpenPdf(pub.PdfUrl)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Constitution Section */}
        {constitutionPubs.length > 0 && (
          <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5">
            <div className="flex m-auto">
              <section className="py-10 px-5 w-[100%]">
                <div
                  className="flex flex-col shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] w-[100%]
                             my-4 rounded-[14px] bg-[#B222] text-[#7F1734] items-center border-white md:w-[95%] lg:w-[100%]"
                >
                  <div
                    className="mx-4 md:mx-10 my-5 flex-col items-center m-auto text-center
                               text-sm md:text-[1.0em] lg:text-[1.0em] xl:text-[1.3em] 2xl:text-[1.3em]"
                  >
                    <div className="flex items-center w-[100%]">
                      <div className="mx-auto font-bold">SLSQ Constitution</div>
                    </div>
                    <hr className="border-1 border-[#800020] p-2" />
                    <div className="flex justify-center flex-col md:flex-row w-[100%] px-2">
                      {constitutionPubs.map((pub) => (
                        <PdfButton
                          key={pub.Id}
                          label={pub.Title}
                          onClick={() => handleOpenPdf(pub.PdfUrl)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5">
          <div className="flex m-auto">
            <section className="py-10 px-5 w-[100%]">
              <div
                className="flex flex-col md:flex-row w-[100%] m-auto justify-around
                           text-sm md:text-[0.7em] lg:text-[1.0em] xl:text-[1.3em] 2xl:text-[1.3em] items-center"
              >
                <div>
                  <Download
                    handleClick={() => handleDownloadFile(Membership_form_Revised, "Membership-Form-Revised")}
                    text="Membership Form download"
                  />
                </div>
                <div>
                  <Download
                    handleClick={() => handleDownloadFile(NominationForm, "NominationForm")}
                    text="Nomination Form download"
                  />
                </div>
                <div>
                  <Download
                    handleClick={() => handleDownloadFile(ProxyForm, "ProxyForm")}
                    text="Proxy Form download"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Publications;
