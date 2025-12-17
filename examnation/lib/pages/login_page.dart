import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_cubit.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailCtrl = TextEditingController();
  final _pwCtrl = TextEditingController();
  bool _loading = false;
  final _formKey = GlobalKey<FormState>();
  @override
  void dispose() {
    _emailCtrl.dispose();
    _pwCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Se connecter')),
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
                          'Bienvenue',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Connectez-vous pour continuer',
                          style: TextStyle(
                            color: Color.fromARGB(137, 33, 118, 230),
                          ),
                        ),
                        const SizedBox(height: 18),
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
                        const SizedBox(height: 20),
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
                                    final ok = await auth.login(
                                      _emailCtrl.text.trim(),
                                      _pwCtrl.text.trim(),
                                    );
                                    if (!mounted) return;
                                    setState(() => _loading = false);
                                    if (!ok) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text(
                                            'Échec de la connexion',
                                          ),
                                        ),
                                      );
                                    }
                                  } catch (e) {
                                    if (!mounted) return;
                                    setState(() => _loading = false);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text('Erreur: $e')),
                                    );
                                  }
                                },
                                child: const Text('Se connecter'),
                              ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.push('/signup'),
                          child: const Text('Créer un compte'),
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
