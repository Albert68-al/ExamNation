import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_cubit.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _pwCtrl = TextEditingController();
  final _schoolCtrl = TextEditingController();
  final _levelCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  DateTime? _birthDate;
  final _birthCtrl = TextEditingController();
  bool _loading = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _pwCtrl.dispose();
    _schoolCtrl.dispose();
    _levelCtrl.dispose();
    _cityCtrl.dispose();
    _birthCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('S’inscrire')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: Card(
                color: Theme.of(context).colorScheme.surface.withOpacity(0.85),
                elevation: 6,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Créer un compte',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _nameCtrl,
                          decoration: const InputDecoration(labelText: 'Nom'),
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Entrez votre nom'
                              : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(labelText: 'Email'),
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Entrez un email'
                              : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _pwCtrl,
                          obscureText: true,
                          decoration: const InputDecoration(
                            labelText: 'Mot de passe',
                          ),
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Entrez le mot de passe'
                              : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _schoolCtrl,
                          decoration: const InputDecoration(
                            labelText: 'École / établissement',
                          ),
                          validator: (v) => (v == null || v.trim().isEmpty)
                              ? 'Entrez l\'école'
                              : null,
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _levelCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Niveau (ex: 2nd, Terminale)',
                          ),
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _birthCtrl,
                          readOnly: true,
                          decoration: const InputDecoration(
                            labelText: 'Date de naissance',
                          ),
                          onTap: () async {
                            final now = DateTime.now();
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: DateTime(now.year - 18),
                              firstDate: DateTime(1900),
                              lastDate: now,
                            );
                            if (picked != null) {
                              setState(() {
                                _birthDate = picked;
                                _birthCtrl.text = picked
                                    .toIso8601String()
                                    .split('T')
                                    .first;
                              });
                            }
                          },
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _cityCtrl,
                          decoration: const InputDecoration(labelText: 'Ville'),
                        ),
                        const SizedBox(height: 18),
                        _loading
                            ? const Center(child: CircularProgressIndicator())
                            : ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 14,
                                  ),
                                ),
                                onPressed: () async {
                                  if (!_formKey.currentState!.validate())
                                    return;
                                  setState(() => _loading = true);
                                  try {
                                    final auth = context.read<AuthCubit>();
                                    final ok = await auth.signup(
                                      _nameCtrl.text.trim(),
                                      _emailCtrl.text.trim(),
                                      _pwCtrl.text.trim(),
                                      school: _schoolCtrl.text.trim().isEmpty
                                          ? null
                                          : _schoolCtrl.text.trim(),
                                      level: _levelCtrl.text.trim().isEmpty
                                          ? null
                                          : _levelCtrl.text.trim(),
                                      birthDate: _birthDate == null
                                          ? null
                                          : _birthDate!
                                                .toIso8601String()
                                                .split('T')
                                                .first,
                                      city: _cityCtrl.text.trim().isEmpty
                                          ? null
                                          : _cityCtrl.text.trim(),
                                    );
                                    if (!mounted) return;
                                    setState(() => _loading = false);
                                    if (!ok) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Échec de l’enregistrement',
                                          ),
                                        ),
                                      );
                                    } else {
                                      // successful signup; let router redirect or explicitly go to home
                                      if (mounted) context.go('/');
                                    }
                                  } catch (e) {
                                    if (!mounted) return;
                                    setState(() => _loading = false);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text('Erreur: $e')),
                                    );
                                  }
                                },
                                child: const Text('Créer'),
                              ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
