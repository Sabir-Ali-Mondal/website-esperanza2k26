"use client";

import { useEffect, useState } from "react";
import {
  getAllSponsors,
  deleteSponsor,
  updateSponsor,
  createSponsor,
} from "@/actions/admin/sponsors.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3 } from "lucide-react";
import customSwal from "@/utils/swal";
import SponsorModal from "@/components/Admin/SponsorModal";

interface Sponsor {
  _id: string;
  name: string;
  logoUrl: string;
  website: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    const loadSponsors = async () => {
      const result = await getAllSponsors();
      if (result.success) {
        const allSponsors = result.sponsors || [];
        setSponsors(allSponsors);
        setFilteredSponsors(allSponsors);
      }
      setLoading(false);
    };
    loadSponsors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSponsors(sponsors);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSponsors(
        sponsors.filter((s) => s.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, sponsors]);

  const handleDeleteSponsor = async (sponsorId: string) => {
    const result = await customSwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    });

    if (result.isConfirmed) {
      const res = await deleteSponsor(sponsorId);
      if (res.success) {
        customSwal.fire("Deleted!", res.message, "success");
        setSponsors((prev) => prev.filter((s) => s._id !== sponsorId));
      } else {
        customSwal.fire("Error!", res.message, "error");
      }
    }
  };

  const handleSaveSponsor = async (data: Partial<Sponsor>) => {
    if (editingSponsor) {
      const res = await updateSponsor(editingSponsor._id, data);
      if (res.success) {
        customSwal.fire("Success!", res.message, "success");
        setSponsors((prev) =>
          prev.map((s) => (s._id === editingSponsor._id ? { ...s, ...data } : s))
        );
      } else {
        customSwal.fire("Error!", res.message, "error");
      }
    } else {
      const res = await createSponsor(data as any);
      if (res.success) {
        customSwal.fire("Success!", res.message, "success");
        setSponsors((prev) => [res.sponsor, ...prev]);
      } else {
        customSwal.fire("Error!", res.message, "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Sponsors Management
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 w-full sm:w-64"
          />
          <Button
            onClick={() => {
              setEditingSponsor(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sponsor
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900/80 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">All Sponsors</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-gray-800/50 animate-pulse"
                >
                  <div className="h-6 w-2/3 bg-gray-700 rounded mb-3" />
                  <div className="h-4 w-1/2 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSponsors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No sponsors found
                </div>
              ) : (
                filteredSponsors.map((sponsor) => (
                  <div
                    key={sponsor._id}
                    className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {sponsor.logoUrl && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
                            <img
                              src={sponsor.logoUrl}
                              alt={sponsor.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {sponsor.name}
                          </h3>
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 break-all"
                          >
                            {sponsor.website}
                          </a>
                          {sponsor.description && (
                            <p className="text-sm text-gray-400 mt-2">
                              {sponsor.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingSponsor(sponsor);
                            setModalOpen(true);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteSponsor(sponsor._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <SponsorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sponsor={editingSponsor}
        onSave={handleSaveSponsor}
      />
    </div>
  );
}
