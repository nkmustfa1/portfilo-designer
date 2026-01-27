import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDesignerInfo, useHomeSettings, useFooterSettings, useBrandSettings, useUpdateSiteSettings, DesignerInfo, HomeSettings, FooterSettings, FooterNavLink, FooterSocialLink, BrandSettings, WorkExperience, Certification } from '@/hooks/useSiteSettings';
import { useUploadImage } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, Upload, X, Plus, Briefcase, Trash2, Award } from 'lucide-react';
import { GlassBackground, GlassCard } from '@/components/ui/GlassBackground';
import { TYPOGRAPHY_PRESETS } from "@/config/typographyPresets"
import type { TypographyPresetKey } from "@/config/typographyPresets"

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { data: designerInfo, isLoading: designerLoading } = useDesignerInfo();
  const { data: homeSettings, isLoading: homeLoading } = useHomeSettings();
  const { data: footerSettings, isLoading: footerLoading } = useFooterSettings();
  const { data: brandSettings, isLoading: brandLoading } = useBrandSettings();
  const updateSettings = useUpdateSiteSettings();
  const uploadImage = useUploadImage();
  const portraitRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

 const [designer, setDesigner] = useState<DesignerInfo>({
  name: '',

  tagline: { en: '', ar: '' },
  heroIntroduction: { en: '', ar: '' },
  biography: { en: '', ar: '' },

  philosophy: { en: '', ar: '' },
  approach: { en: '', ar: '' },
 
  skills: [],
  clients: [],
  workExperience: [],
  certifications: [],
  
  location: '',
  email: '',
  phone: '',
  availability: {
  en: '',
  ar: '',
},
education: {
  en: '',
  ar: '',
},

  socialLinks: {},
  portraitImage: ''
});

const [home, setHome] = useState<HomeSettings>({
  heroImage: '',
  heroTitle: {
    en: '',
    ar: '',
  },
  heroSubtitle: {
    en: '',
    ar: '',
  },
});


  const [footer, setFooter] = useState<FooterSettings>({
    copyrightText: '',
    showNavigation: true,
    showSocialLinks: true,
    navigationLinks: [
      { name: 'Home', path: '/' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    socialLinks: []
  });

const [brand, setBrand] = useState<BrandSettings>({
  logoUrl: '',
  useLogo: false,
  headerLogoSize: 'medium',
  footerLogoSize: 'medium',

  typography: {
    preset: 'modern',
    fontLatin: 'inter',
    fontArabic: 'ibm',
    baseFontSize: 16,
    headingWeight: 600,
    bodyWeight: 400,
  },
})


  const [skillInput, setSkillInput] = useState('');
  const [clientInput, setClientInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (designerInfo) {
      setDesigner(designerInfo);
    }
  }, [designerInfo]);

  useEffect(() => {
    if (homeSettings) {
      setHome(homeSettings);
    }
  }, [homeSettings]);

  useEffect(() => {
    // Pre-populate footer social links from designer profile if empty
    const getSocialLinksFromDesigner = () => {
      if (!designerInfo?.socialLinks) return [];
      return Object.entries(designerInfo.socialLinks)
        .filter(([_, url]) => url)
        .map(([platform, url]) => ({ 
          platform: platform as 'instagram' | 'linkedin' | 'behance' | 'dribbble', 
          url: url! 
        }));
    };

    if (footerSettings) {
      const socialLinksToUse = footerSettings.socialLinks?.length 
        ? footerSettings.socialLinks 
        : getSocialLinksFromDesigner();
      
      setFooter({
        ...footerSettings,
        navigationLinks: footerSettings.navigationLinks?.length ? footerSettings.navigationLinks : [
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: 'About', path: '/about' },
          { name: 'Contact', path: '/contact' },
        ],
        socialLinks: socialLinksToUse
      });
    } else if (designerInfo) {
      // No footer settings saved yet, use defaults with designer's social links
      setFooter(prev => ({
        ...prev,
        socialLinks: getSocialLinksFromDesigner()
      }));
    }
  }, [footerSettings, designerInfo]);

useEffect(() => {
  const t = brand?.typography
  if (!t) return

  // يطبق القيم مباشرة
}, [brand?.typography])

  const handleImageUpload = async (file: File, type: 'portrait' | 'hero' | 'logo') => {
    setUploading(true);
    try {
      const url = await uploadImage.mutateAsync(file);
      if (type === 'portrait') {
        setDesigner(prev => ({ ...prev, portraitImage: url }));
      } else if (type === 'hero') {
        setHome(prev => ({ ...prev, heroImage: url }));
      } else if (type === 'logo') {
        setBrand(prev => ({ ...prev, logoUrl: url }));
      }
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setDesigner(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setDesigner(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const addClient = () => {
    if (clientInput.trim()) {
      setDesigner(prev => ({ ...prev, clients: [...prev.clients, clientInput.trim()] }));
      setClientInput('');
    }
  };

  const removeClient = (index: number) => {
    setDesigner(prev => ({ ...prev, clients: prev.clients.filter((_, i) => i !== index) }));
  };

const addWorkExperience = () => {
  const newExp: WorkExperience = {
    id: crypto.randomUUID(),
    company: { en: '', ar: '' },
    role: { en: '', ar: '' },
    description: { en: '', ar: '' },
    startDate: '',
    endDate: ''
  };

  setDesigner(prev => ({
    ...prev,
    workExperience: [...(prev.workExperience || []), newExp]
  }));
};


const updateWorkExperience = <K extends keyof WorkExperience>(
  id: string,
  field: K,
  value: WorkExperience[K]
) => {
  setDesigner(prev => ({
    ...prev,
    workExperience: prev.workExperience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    )
  }));
};


  const removeWorkExperience = (id: string) => {
    setDesigner(prev => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter(exp => exp.id !== id)
    }));
  };

const addCertification = () => {
  const newCert: Certification = {
    id: crypto.randomUUID(),
    title: { en: '', ar: '' },
    issuer: { en: '', ar: '' },
    year: '',
    type: 'certification'
  };

  setDesigner(prev => ({
    ...prev,
    certifications: [...(prev.certifications || []), newCert]
  }));
};


const updateCertification = <K extends keyof Certification>(
  id: string,
  field: K,
  value: Certification[K]
) => {
  setDesigner(prev => ({
    ...prev,
    certifications: prev.certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    )
  }));
};

  const removeCertification = (id: string) => {
    setDesigner(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(cert => cert.id !== id)
    }));
  };

  const saveDesignerInfo = async () => {
    await updateSettings.mutateAsync({ key: 'designer_info', value: designer });
  };

  const saveHomeSettings = async () => {
    await updateSettings.mutateAsync({ key: 'home_settings', value: home });
  };

  const saveFooterSettings = async () => {
    await updateSettings.mutateAsync({ key: 'footer_settings', value: footer });
  };

  const saveBrandSettings = async () => {
    await updateSettings.mutateAsync({ key: 'brand_settings', value: brand });
  };

  if (authLoading || designerLoading || homeLoading || footerLoading || brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <GlassBackground variant="hero" />
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
              <p className="text-muted-foreground">Manage your website content and information</p>
            </div>
          </div>

          <Tabs defaultValue="brand">
            <TabsList className="mb-6 glass flex-wrap">
              <TabsTrigger value="brand">Brand / Logo</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="certifications">Awards</TabsTrigger>
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
            </TabsList>

            <TabsContent value="brand">
              <GlassCard className="border-glass-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Brand / Logo Settings</CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="useLogo"
                      checked={brand.useLogo}
                      onChange={(e) => setBrand(prev => ({ ...prev, useLogo: e.target.checked }))}
                      className="h-4 w-4 accent-primary"
                    />
                    <Label htmlFor="useLogo" className="text-foreground/80">Use logo image instead of text name</Label>
                  </div>
                      <div className="space-y-2">
  <Label>Typography Preset</Label>
<select
  value={brand.typography?.preset ?? 'modern'}
  onChange={(e) => {
    const presetKey = e.target.value as TypographyPresetKey
    const preset = TYPOGRAPHY_PRESETS[presetKey]

    setBrand(prev => ({
      ...prev,
      typography: {
        ...preset,
        preset: presetKey,
      },
    }))
  }}
  className="w-full h-10 px-3 rounded-md border border-input bg-background"
></select>
 
  <p className="text-xs text-muted-foreground">
    Applies a complete typography style instantly
  </p>
</div>
<div
  className="p-4 border rounded-lg"
  style={{
    fontFamily: brand.typography.fontLatin,
    fontSize: brand.typography.baseFontSize
  }}
>
  <p>English Preview Text</p>
  <p dir="rtl" style={{ fontFamily: brand.typography.fontArabic }}>
    معاينة النص العربي
  </p>
</div>

                  <div className="space-y-2">
                    <Label className="text-foreground/80">Logo Image</Label>
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'logo');
                      }}
                    />
                    <div className="flex items-center gap-4">
                      {brand.logoUrl && (
                        <div className="border border-foreground/10 rounded-md p-2 bg-background/50">
                          <img
                            src={brand.logoUrl}
                            alt="Logo"
                            className="h-12 w-auto object-contain"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => logoRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                        Upload Logo
                      </Button>
                      {brand.logoUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setBrand(prev => ({ ...prev, logoUrl: '' }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recommended: PNG or SVG with transparent background
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-foreground/80">Header Logo Size</Label>
                      <select
                        value={brand.headerLogoSize || 'medium'}
                        onChange={(e) => setBrand(prev => ({ ...prev, headerLogoSize: e.target.value as 'small' | 'medium' | 'large' }))}
                        className="w-full h-10 px-3 rounded-md border border-foreground/10 bg-background/50 text-foreground"
                      >
                        <option value="small">Small (24px)</option>
                        <option value="medium">Medium (32px)</option>
                        <option value="large">Large (48px)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground/80">Footer Logo Size</Label>
                      <select
                        value={brand.footerLogoSize || 'medium'}
                        onChange={(e) => setBrand(prev => ({ ...prev, footerLogoSize: e.target.value as 'small' | 'medium' | 'large' }))}
                        className="w-full h-10 px-3 rounded-md border border-foreground/10 bg-background/50 text-foreground"
                      >
                        <option value="small">Small (24px)</option>
                        <option value="medium">Medium (32px)</option>
                        <option value="large">Large (48px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button onClick={saveBrandSettings} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Brand Settings
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="profile">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={designer.name}
                      onChange={(e) => setDesigner(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>

<Input
  value={designer.tagline?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      tagline: { ...prev.tagline, en: e.target.value }
    }))
  }
  placeholder="Tagline (English)"
/>

<Input
  value={designer.tagline?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      tagline: { ...prev.tagline, ar: e.target.value }
    }))
  }
  placeholder="الشعار (عربي)"
  dir="rtl"
/>

                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Portrait Image</Label>
                  <input
                    ref={portraitRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'portrait');
                    }}
                  />
                  <div className="flex items-center gap-4">
                    {designer.portraitImage && (
                      <img
                        src={designer.portraitImage}
                        alt="Portrait"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => portraitRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      Upload Photo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                 <Label>Hero Introduction</Label>

<Textarea
  value={designer.heroIntroduction?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      heroIntroduction: { ...prev.heroIntroduction, en: e.target.value }
    }))
  }
  placeholder="Hero introduction (English)"
  rows={2}
/>

<Textarea
  value={designer.heroIntroduction?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      heroIntroduction: { ...prev.heroIntroduction, ar: e.target.value }
    }))
  }
  placeholder="المقدمة (عربي)"
  rows={2}
  dir="rtl"
/>

                </div>

                <div className="space-y-2">
                  <Label>Biography</Label>

<Textarea
  value={designer.biography?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      biography: { ...prev.biography, en: e.target.value }
    }))
  }
  placeholder="Biography (English)"
  rows={4}
/>

<Textarea
  value={designer.biography?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      biography: { ...prev.biography, ar: e.target.value }
    }))
  }
  placeholder="السيرة الذاتية (عربي)"
  rows={4}
  dir="rtl"
/>

                </div>

                <div className="space-y-2">
                  <Label>Philosophy</Label>

<Textarea
  value={designer.philosophy?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy,
        en: e.target.value,
      },
    }))
  }
  placeholder="Design philosophy (English)"
  rows={3}
/>

<Textarea
  value={designer.philosophy?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      philosophy: {
        ...prev.philosophy,
        ar: e.target.value,
      },
    }))
  }
  placeholder="فلسفة التصميم (عربي)"
  rows={3}
  dir="rtl"
/>

                  <p className="text-xs text-muted-foreground">يظهر في قسم "Philosophy" في صفحة About</p>
                </div>

                <div className="space-y-2">
                <Label>Approach</Label>

<Textarea
  value={designer.approach?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      approach: {
        ...prev.approach,
        en: e.target.value,
      },
    }))
  }
  placeholder="Work approach (English)"
  rows={3}
/>

<Textarea
  value={designer.approach?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      approach: {
        ...prev.approach,
        ar: e.target.value,
      },
    }))
  }
  placeholder="منهج العمل (عربي)"
  rows={3}
  dir="rtl"
/>

                  <p className="text-xs text-muted-foreground">يظهر في قسم "Approach" في صفحة About</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                   <Label>Education</Label>

<Input
  value={designer.education?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      education: {
        ...prev.education,
        en: e.target.value,
      },
    }))
  }
  placeholder="Education (English)"
/>

<Input
  value={designer.education?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      education: {
        ...prev.education,
        ar: e.target.value,
      },
    }))
  }
  placeholder="التعليم (عربي)"
  dir="rtl"
/>

                  </div>
                  <div className="space-y-2">
                   <Label>Availability</Label>

<Input
  value={designer.availability?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        en: e.target.value,
      },
    }))
  }
  placeholder="Availability (English)"
/>

<Input
  value={designer.availability?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        ar: e.target.value,
      },
    }))
  }
  placeholder="متاح للعمل (عربي)"
  dir="rtl"
/>
<Label>Hero Quote</Label>

<Textarea
  value={designer.heroQuote?.en || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      heroQuote: { ...prev.heroQuote, en: e.target.value }
    }))
  }
  placeholder="Hero quote (English)"
/>

<Textarea
  value={designer.heroQuote?.ar || ''}
  onChange={(e) =>
    setDesigner(prev => ({
      ...prev,
      heroQuote: { ...prev.heroQuote, ar: e.target.value }
    }))
  }
  placeholder="النص الرئيسي (عربي)"
  dir="rtl"
/>


                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {designer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(index)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>


                <Button onClick={saveDesignerInfo} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="experience">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience (الخبرات المهنية)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  أضف خبراتك المهنية لعرضها في صفحة About
                </p>

                {(designer.workExperience || []).map((exp, index) => (
                  <div key={exp.id} className="p-4 border border-glass-border rounded-lg bg-background/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Experience {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWorkExperience(exp.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                       <Label>Company (English)</Label>
<Input
  value={exp.company.en}
  onChange={(e) =>
    updateWorkExperience(exp.id, 'company', {
      ...exp.company,
      en: e.target.value
    })
  }
/>

<Input
  dir="rtl"
  value={exp.company.ar}
  onChange={(e) =>
    updateWorkExperience(exp.id, 'company', {
      ...exp.company,
      ar: e.target.value
    })
  }
/>


<Label>الشركة (عربي)</Label>
<Input
  value={exp.company.ar}
  dir="rtl"
  onChange={(e) =>
    updateWorkExperience(exp.id, 'company', {
      ...exp.company,
      ar: e.target.value
    })
  }
/>

                      </div>
                      <div className="space-y-2">
                        <Label>Role / المنصب</Label>
                       <Input
  value={exp.role.en}
  onChange={(e) =>
    updateWorkExperience(exp.id, 'role', {
      ...exp.role,
      en: e.target.value
    })
  }
/>

<Input
  dir="rtl"
  value={exp.role.ar}
  onChange={(e) =>
    updateWorkExperience(exp.id, 'role', {
      ...exp.role,
      ar: e.target.value
    })
  }
/>

                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Start Date / تاريخ البدء</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="e.g., 2020 or Jan 2020"
                          className="bg-background/50 border-glass-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date / تاريخ الانتهاء</Label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="e.g., Present or Dec 2023"
                          className="bg-background/50 border-glass-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description / الوصف</Label>
                      <Textarea
  value={exp.description.en}
  onChange={(e) =>
    updateWorkExperience(exp.id, 'description', {
      ...exp.description,
      en: e.target.value
    })
  }
/>

<Textarea
  dir="rtl"
  value={exp.description.ar}
  onChange={(e) =>
    updateWorkExperience(exp.id, 'description', {
      ...exp.description,
      ar: e.target.value
    })
  }
/>

                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addWorkExperience}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>

                <Button onClick={saveDesignerInfo} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Work Experience
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="certifications">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications & Awards (الشهادات والجوائز)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  أضف شهاداتك وجوائزك لعرضها في صفحة About
                </p>

                {(designer.certifications || []).map((cert, index) => (
                  <div key={cert.id} className="p-4 border border-glass-border rounded-lg bg-background/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {cert.type === 'award' ? '🏆 Award' : '📜 Certification'} {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertification(cert.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Type / النوع</Label>
                        <select
  value={cert.type}
  onChange={(e) =>
    updateCertification(
      cert.id,
      'type',
      e.target.value as 'certification' | 'award'
    )
  }
  className="w-full h-10 px-3 rounded-md border border-glass-border bg-background/50 text-foreground"
>
  <option value="certification">Certification (شهادة)</option>
  <option value="award">Award (جائزة)</option>
</select>

                      </div>
                      <div className="space-y-2">
                        <Label>Year / السنة</Label>
                        <Input
                          value={cert.year}
                          onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                          placeholder="e.g., 2023"
                          className="bg-background/50 border-glass-border"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                       <Label>Title (English)</Label>
<Input
  value={cert.title.en}
  onChange={(e) =>
    updateCertification(cert.id, 'title', {
      ...cert.title,
      en: e.target.value
    })
  }
/>

<Input
  dir="rtl"
  value={cert.title.ar}
  onChange={(e) =>
    updateCertification(cert.id, 'title', {
      ...cert.title,
      ar: e.target.value
    })
  }
/>


<Label>العنوان (عربي)</Label>
<Input
  value={cert.title.ar}
  dir="rtl"
  onChange={(e) =>
    updateCertification(cert.id, 'title', {
      ...cert.title,
      ar: e.target.value
    })
  }
/>

                      </div>
                      <div className="space-y-2">
                        <Label>Issuer / الجهة المانحة</Label>
                        <Input
  value={cert.issuer.en}
  onChange={(e) =>
    updateCertification(cert.id, 'issuer', {
      ...cert.issuer,
      en: e.target.value
    })
  }
/>

<Input
  dir="rtl"
  value={cert.issuer.ar}
  onChange={(e) =>
    updateCertification(cert.id, 'issuer', {
      ...cert.issuer,
      ar: e.target.value
    })
  }
/>

                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertification}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification or Award
                </Button>

                <Button onClick={saveDesignerInfo} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Certifications & Awards
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="home">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Home Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Hero Image</Label>
                  <input
                    ref={heroRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'hero');
                    }}
                  />
                  {home.heroImage && (
                    <img
                      src={home.heroImage}
                      alt="Hero"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => heroRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload Hero Image
                  </Button>
                </div>

               <div className="space-y-4">
  <Label>Hero Title</Label>

  <Input
    value={home.heroTitle?.en || ''}
    onChange={(e) =>
      setHome(prev => ({
        ...prev,
        heroTitle: {
          ...prev.heroTitle,
          en: e.target.value,
        },
      }))
    }
    placeholder="Hero Title (English)"
  />

  <Input
    value={home.heroTitle?.ar || ''}
    onChange={(e) =>
      setHome(prev => ({
        ...prev,
        heroTitle: {
          ...prev.heroTitle,
          ar: e.target.value,
        },
      }))
    }
    placeholder="عنوان الهيرو (عربي)"
    dir="rtl"
  />
</div>


                <div className="space-y-4">
  <Label>Hero Subtitle</Label>

  <Input
    value={home.heroSubtitle?.en || ''}
    onChange={(e) =>
      setHome(prev => ({
        ...prev,
        heroSubtitle: {
          ...prev.heroSubtitle,
          en: e.target.value,
        },
      }))
    }
    placeholder="Hero Subtitle (English)"
  />

  <Input
    value={home.heroSubtitle?.ar || ''}
    onChange={(e) =>
      setHome(prev => ({
        ...prev,
        heroSubtitle: {
          ...prev.heroSubtitle,
          ar: e.target.value,
        },
      }))
    }
    placeholder="الوصف الفرعي (عربي)"
    dir="rtl"
  />
</div>


                <Button onClick={saveHomeSettings} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Home Settings
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="contact">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={designer.email}
                    onChange={(e) => setDesigner(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="hello@example.com"
                  />
                </div>
                <Button onClick={saveDesignerInfo} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Contact Info
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="social">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={designer.socialLinks.instagram || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value } 
                      }))}
                      placeholder="https://instagram.com/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      value={designer.socialLinks.linkedin || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value } 
                      }))}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Behance</Label>
                    <Input
                      value={designer.socialLinks.behance || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, behance: e.target.value } 
                      }))}
                      placeholder="https://behance.net/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dribbble</Label>
                    <Input
                      value={designer.socialLinks.dribbble || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, dribbble: e.target.value } 
                      }))}
                      placeholder="https://dribbble.com/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter / X</Label>
                    <Input
                      value={designer.socialLinks.twitter || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value } 
                      }))}
                      placeholder="https://x.com/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input
                      value={designer.socialLinks.youtube || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, youtube: e.target.value } 
                      }))}
                      placeholder="https://youtube.com/@yourchannel"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input
                      value={designer.socialLinks.facebook || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value } 
                      }))}
                      placeholder="https://facebook.com/yourpage"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input
                      value={designer.socialLinks.tiktok || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, tiktok: e.target.value } 
                      }))}
                      placeholder="https://tiktok.com/@yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pinterest</Label>
                    <Input
                      value={designer.socialLinks.pinterest || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, pinterest: e.target.value } 
                      }))}
                      placeholder="https://pinterest.com/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub</Label>
                    <Input
                      value={designer.socialLinks.github || ''}
                      onChange={(e) => setDesigner(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, github: e.target.value } 
                      }))}
                      placeholder="https://github.com/yourusername"
                      className="bg-background/50 border-foreground/10"
                    />
                  </div>
                </div>
                <Button onClick={saveDesignerInfo} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Social Links
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="footer">
            <GlassCard className="border-glass-border">
              <CardHeader>
                <CardTitle className="text-foreground">Footer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input
                    value={footer.copyrightText}
                    onChange={(e) => setFooter(prev => ({ ...prev, copyrightText: e.target.value }))}
                    placeholder="© 2024 Your Name. All rights reserved."
                  />
                  <p className="text-sm text-muted-foreground">Leave empty to use default text with your name and current year.</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Navigation Links</Label>
                    <p className="text-sm text-muted-foreground">Display navigation links in the footer</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={footer.showNavigation}
                    onChange={(e) => setFooter(prev => ({ ...prev, showNavigation: e.target.checked }))}
                    className="h-4 w-4"
                  />
                </div>

                {footer.showNavigation && (
                  <div className="space-y-4">
                    <Label>Navigation Links</Label>
                    <div className="space-y-3">
                      {footer.navigationLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={link.name}
                            onChange={(e) => {
                              const newLinks = [...footer.navigationLinks];
                              newLinks[index] = { ...newLinks[index], name: e.target.value };
                              setFooter(prev => ({ ...prev, navigationLinks: newLinks }));
                            }}
                            placeholder="Link Name"
                            className="flex-1"
                          />
                          <Input
                            value={link.path}
                            onChange={(e) => {
                              const newLinks = [...footer.navigationLinks];
                              newLinks[index] = { ...newLinks[index], path: e.target.value };
                              setFooter(prev => ({ ...prev, navigationLinks: newLinks }));
                            }}
                            placeholder="/path"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newLinks = footer.navigationLinks.filter((_, i) => i !== index);
                              setFooter(prev => ({ ...prev, navigationLinks: newLinks }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFooter(prev => ({
                          ...prev,
                          navigationLinks: [...prev.navigationLinks, { name: '', path: '' }]
                        }));
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Social Links</Label>
                    <p className="text-sm text-muted-foreground">Display social media icons in the footer</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={footer.showSocialLinks}
                    onChange={(e) => setFooter(prev => ({ ...prev, showSocialLinks: e.target.checked }))}
                    className="h-4 w-4"
                  />
                </div>

                {footer.showSocialLinks && (
                  <div className="space-y-4">
                    <Label>Social Links</Label>
                    <p className="text-sm text-muted-foreground">Add social links to display in the footer. Leave empty to use links from your profile.</p>
                    <div className="space-y-3">
                      {(footer.socialLinks || []).map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <select
                            value={link.platform}
                            onChange={(e) => {
                              const newLinks = [...(footer.socialLinks || [])];
                              newLinks[index] = { ...newLinks[index], platform: e.target.value as 'instagram' | 'linkedin' | 'behance' | 'dribbble' | 'twitter' | 'youtube' | 'facebook' | 'tiktok' | 'pinterest' | 'github' };
                              setFooter(prev => ({ ...prev, socialLinks: newLinks }));
                            }}
                            className="h-10 rounded-md border border-input bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-zinc-800 dark:text-white"
                          >
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter / X</option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="pinterest">Pinterest</option>
                            <option value="github">GitHub</option>
                            <option value="behance">Behance</option>
                            <option value="dribbble">Dribbble</option>
                          </select>
                          <Input
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...(footer.socialLinks || [])];
                              newLinks[index] = { ...newLinks[index], url: e.target.value };
                              setFooter(prev => ({ ...prev, socialLinks: newLinks }));
                            }}
                            placeholder="https://..."
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newLinks = (footer.socialLinks || []).filter((_, i) => i !== index);
                              setFooter(prev => ({ ...prev, socialLinks: newLinks }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFooter(prev => ({
                          ...prev,
                          socialLinks: [...(prev.socialLinks || []), { platform: 'instagram', url: '' }]
                        }));
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Social Link
                    </Button>
                  </div>
                )}

                <Button onClick={saveFooterSettings} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Footer Settings
                </Button>
              </CardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
